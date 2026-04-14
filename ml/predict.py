import joblib
import pandas as pd

# Load saved model
model = joblib.load("fraud_model.pkl")

# Example claim input (change values to test)
new_claim = pd.DataFrame([{
    "velocity_kmh": 75,
    "device_reuse_count": 3,
    "weather_match": 0,
    "claim_hour": 2,
    "claims_this_week": 4
}])

# Predict fraud
prediction = model.predict(new_claim)[0]
probability = model.predict_proba(new_claim)[0][1]

print("Fraud Prediction (0=Not Fraud, 1=Fraud):", prediction)
print("Fraud Probability:", probability)