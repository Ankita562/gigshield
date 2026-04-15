"""
GigShield — Synthetic Fraud Dataset Generator
Run: python generate_data.py
Output: gigshield_claims.csv  (5000 rows)
"""

import pandas as pd
import numpy as np

np.random.seed(42)
N = 5000

# ── Claim types your product supports ─────────────────────────────────────────
CLAIM_TYPES = ['rain_damage', 'flood', 'extreme_heat', 'poor_aqi', 'natural_disaster']
ZONES       = ['Koramangala', 'Indiranagar', 'Whitefield', 'Hebbal', 'Jayanagar',
               'Electronic_City', 'Marathahalli', 'BTM_Layout']

def generate_dataset(n=N):
    rows = []
    for _ in range(n):
        is_fraud = np.random.random() < 0.22   # ~22% fraud rate

        claim_type  = np.random.choice(CLAIM_TYPES)
        zone        = np.random.choice(ZONES)
        hour        = int(np.random.choice(range(24)))
        day_of_week = int(np.random.randint(0, 7))  # 0=Mon

        # ── Worker profile ─────────────────────────────────────────────────────
        days_since_joining  = int(np.random.exponential(180))   # avg 6 months
        claims_last_30_days = int(np.random.poisson(1.2))
        worker_age          = int(np.random.normal(28, 6))
        worker_age          = max(18, min(60, worker_age))

        # ── Claim financials ───────────────────────────────────────────────────
        # Legit claims: centered around realistic amounts per type
        base_amounts = {
            'rain_damage': 1500, 'flood': 4000, 'extreme_heat': 800,
            'poor_aqi': 600, 'natural_disaster': 6000
        }
        base = base_amounts[claim_type]
        if is_fraud:
            # Fraudsters claim more, but not always — some are subtle
            claim_amount = base * np.random.uniform(1.5, 4.0) if np.random.random() < 0.6 \
                           else base * np.random.uniform(0.8, 1.2)
        else:
            claim_amount = base * np.random.uniform(0.5, 1.5)
        claim_amount = round(claim_amount, 2)

        # ── Telemetry signals ──────────────────────────────────────────────────
        # Velocity: impossible GPS jump between check-in and claim
        if is_fraud:
            velocity_kmh = float(np.random.choice(
                [np.random.uniform(0, 20), np.random.uniform(80, 300)],
                p=[0.4, 0.6]
            ))
        else:
            velocity_kmh = float(np.random.uniform(0, 25))
        velocity_flag = int(velocity_kmh > 60)

        # Device reuse: same phone filing for multiple accounts
        if is_fraud:
            device_accounts_today = int(np.random.choice([1, 2, 3, 4, 5], p=[0.3, 0.2, 0.2, 0.15, 0.15]))
        else:
            device_accounts_today = int(np.random.choice([1, 2], p=[0.95, 0.05]))
        device_flag = int(device_accounts_today >= 3)

        # Weather mismatch: claimed weather doesn't match Open-Meteo
        if is_fraud:
            weather_matches_claim = int(np.random.random() < 0.35)  # often lying
        else:
            weather_matches_claim = int(np.random.random() < 0.92)  # usually true
        weather_flag = int(not weather_matches_claim)

        # ── Derived features ───────────────────────────────────────────────────
        # AQI reading at time of claim (if claim type is poor_aqi)
        if claim_type == 'poor_aqi':
            actual_aqi = int(np.random.randint(50, 200))
            claimed_aqi_severe = int(np.random.random() < (0.8 if is_fraud else 0.3))
        else:
            actual_aqi = int(np.random.randint(30, 120))
            claimed_aqi_severe = 0

        # Rainfall mm at zone at time of claim
        if claim_type in ['rain_damage', 'flood']:
            actual_rainfall_mm = float(np.random.uniform(0 if is_fraud and np.random.random()<0.5 else 10, 80))
        else:
            actual_rainfall_mm = float(np.random.uniform(0, 15))

        # Temperature at time of claim
        actual_temp_c = float(np.random.normal(34, 6) if claim_type == 'extreme_heat'
                              else np.random.normal(27, 5))

        # Claims spike: many claims from same zone in short window (coordinated fraud)
        zone_claims_last_hour = int(np.random.poisson(8 if is_fraud and np.random.random()<0.4 else 2))

        # Time-since-shift-start (minutes): fraudsters file very fast or very late
        if is_fraud:
            mins_since_shift_start = float(np.random.choice(
                [np.random.uniform(0, 3), np.random.uniform(400, 600)],
                p=[0.5, 0.5]
            ))
        else:
            mins_since_shift_start = float(np.random.uniform(10, 400))

        # Photo submitted with claim
        photo_submitted = int(np.random.random() < (0.25 if is_fraud else 0.78))

        rows.append({
            'claim_type':               claim_type,
            'zone':                     zone,
            'hour_of_day':              hour,
            'day_of_week':              day_of_week,
            'days_since_joining':       days_since_joining,
            'claims_last_30_days':      claims_last_30_days,
            'worker_age':               worker_age,
            'claim_amount_inr':         claim_amount,
            'velocity_kmh':             round(velocity_kmh, 2),
            'velocity_flag':            velocity_flag,
            'device_accounts_today':    device_accounts_today,
            'device_flag':              device_flag,
            'weather_matches_claim':    weather_matches_claim,
            'weather_flag':             weather_flag,
            'actual_aqi':               actual_aqi,
            'claimed_aqi_severe':       claimed_aqi_severe,
            'actual_rainfall_mm':       round(actual_rainfall_mm, 2),
            'actual_temp_c':            round(actual_temp_c, 2),
            'zone_claims_last_hour':    zone_claims_last_hour,
            'mins_since_shift_start':   round(mins_since_shift_start, 2),
            'photo_submitted':          photo_submitted,
            'is_fraud':                 int(is_fraud),
        })

    df = pd.DataFrame(rows)

    # Encode categoricals
    df['claim_type_enc'] = df['claim_type'].astype('category').cat.codes
    df['zone_enc']       = df['zone'].astype('category').cat.codes

    print(f"Dataset created: {len(df)} rows")
    print(f"Fraud rate: {df['is_fraud'].mean():.1%}")
    print(f"Columns: {list(df.columns)}")
    df.to_csv('gigshield_claims.csv', index=False)
    print("\nSaved to gigshield_claims.csv")
    return df

if __name__ == '__main__':
    generate_dataset()