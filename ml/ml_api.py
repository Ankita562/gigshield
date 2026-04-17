from fastapi import FastAPI
import joblib
import pandas as pd

app = FastAPI()

# Load trained model
model = joblib.load("fraud_model.pkl")

@app.get("/")
def home():
    return {"message": "Fraud Detection API is running!"}

@app.post("/predict")
def predict(data: dict):

    df = pd.DataFrame([{
        "velocity_kmh": data["velocity_kmh"],
        "device_reuse_count": data["device_reuse_count"],
        "weather_match": data["weather_match"],
        "claim_hour": data["claim_hour"],
        "claims_this_week": data["claims_this_week"]
    }])

    prediction = int(model.predict(df)[0])
    probability = float(model.predict_proba(df)[0][1])

    return {
        "fraud_prediction": prediction,
        "fraud_probability": probability
    }