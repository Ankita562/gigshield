"""
GigKavach — Fraud Scoring API
Run: uvicorn fraud_service:app --host 0.0.0.0 --port 8000
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import numpy as np

app = FastAPI(title="GigShield Fraud Detection API", version="1.0")

# Load model on startup
bundle   = pickle.load(open('model.pkl', 'rb'))
model    = bundle['model']
FEATURES = bundle['features']

CLAIM_TYPE_MAP = {
    'rain_damage': 0, 'flood': 1, 'extreme_heat': 2,
    'poor_aqi': 3, 'natural_disaster': 4
}
ZONE_MAP = {
    'BTM_Layout': 0, 'Electronic_City': 1, 'Hebbal': 2,
    'Indiranagar': 3, 'Jayanagar': 4, 'Koramangala': 5,
    'Marathahalli': 6, 'Whitefield': 7
}

class ClaimRequest(BaseModel):
    # Telemetry — computed by your Node.js backend
    velocity_kmh:           float   # GPS speed between last location and claim location
    device_accounts_today:  int     # how many accounts used this device ID today
    weather_matches_claim:  bool    # Open-Meteo says weather matches what they claimed

    # Claim details
    claim_type:             str     # 'rain_damage' | 'flood' | 'extreme_heat' | 'poor_aqi' | 'natural_disaster'
    claim_amount_inr:       float
    photo_submitted:        bool

    # Worker profile (from your DB)
    days_since_joining:     int
    claims_last_30_days:    int
    worker_age:             int

    # Environmental context (from Open-Meteo)
    actual_rainfall_mm:     float
    actual_aqi:             int
    actual_temp_c:          float
    claimed_aqi_severe:     bool    # did they claim AQI was severe?

    # Behavioural
    hour_of_day:            int     # 0-23
    day_of_week:            int     # 0=Monday
    mins_since_shift_start: float
    zone_claims_last_hour:  int     # how many claims from this zone in last hour
    zone:                   str     # zone name

class ScoreResponse(BaseModel):
    fraud_score:    float
    verdict:        str   # 'approve' | 'review' | 'reject'
    flags:          list
    ml_score:       float
    telemetry_boost: float

@app.post('/score', response_model=ScoreResponse)
def score_claim(req: ClaimRequest):
    if req.claim_type not in CLAIM_TYPE_MAP:
        raise HTTPException(400, f"Unknown claim_type: {req.claim_type}")
    if req.zone not in ZONE_MAP:
        raise HTTPException(400, f"Unknown zone: {req.zone}")

    velocity_flag = int(req.velocity_kmh > 60)
    device_flag   = int(req.device_accounts_today >= 3)
    weather_flag  = int(not req.weather_matches_claim)

    features = [[
        velocity_flag,
        device_flag,
        weather_flag,
        req.velocity_kmh,
        req.device_accounts_today,
        CLAIM_TYPE_MAP[req.claim_type],
        req.claim_amount_inr,
        int(req.photo_submitted),
        req.days_since_joining,
        req.claims_last_30_days,
        req.worker_age,
        req.actual_rainfall_mm,
        req.actual_aqi,
        req.actual_temp_c,
        int(req.claimed_aqi_severe),
        req.hour_of_day,
        req.day_of_week,
        req.mins_since_shift_start,
        req.zone_claims_last_hour,
        ZONE_MAP[req.zone],
    ]]

    ml_score = float(model.predict_proba(features)[0][1])

    # Telemetry boost on top of ML score
    boost = (velocity_flag * 0.15) + (device_flag * 0.2) + (weather_flag * 0.15)
    final_score = min(1.0, ml_score + boost)

    flags = []
    if velocity_flag:   flags.append('impossible_speed')
    if device_flag:     flags.append('duplicate_device')
    if weather_flag:    flags.append('weather_mismatch')
    if req.claims_last_30_days > 4: flags.append('high_claim_frequency')
    if not req.photo_submitted:     flags.append('no_photo')

    if final_score > 0.75:
        verdict = 'reject'
    elif final_score > 0.4:
        verdict = 'review'
    else:
        verdict = 'approve'

    return ScoreResponse(
        fraud_score=round(final_score, 3),
        verdict=verdict,
        flags=flags,
        ml_score=round(ml_score, 3),
        telemetry_boost=round(boost, 3),
    )

@app.get('/health')
def health():
    return {"status": "ok", "model_features": len(FEATURES)}