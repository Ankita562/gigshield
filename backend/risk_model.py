from flask import Flask, request, jsonify

app = Flask(__name__)

def normalize(data):
    rain = min(data.get("rain_mm", 0) / 50, 1)
    wind = min(data.get("wind_speed", 0) / 40, 1)
    
    temp_val = data.get("temperature", 30)
    temp = 1 if temp_val > 40 or temp_val < 10 else 0

    distance = min(data.get("distance_km", 0) / 120, 1)
    deliveries = min(data.get("deliveries_per_day", 0) / 40, 1)
    experience = 1 - min(data.get("experience_months", 0) / 24, 1)

    strike = data.get("strike", 0)
    night = data.get("night_shift", 0)

    return {
        "rain": rain,
        "wind": wind,
        "temp": temp,
        "distance": distance,
        "deliveries": deliveries,
        "experience": experience,
        "strike": strike,
        "night": night
    }

def calculate_insurance(data):
    n = normalize(data)

    risk = (
        0.30 * n["rain"] +
        0.15 * n["wind"] +
        0.20 * n["strike"] +
        0.10 * n["distance"] +
        0.10 * n["deliveries"] +
        0.10 * n["experience"] +
        0.05 * n["night"]
    )

    premium = 20 + risk * 80
    payout_cap = 2000 + risk * 8000

    # safety bounds
    premium = max(20, min(premium, 120))
    payout_cap = max(2000, min(payout_cap, 12000))

    return {
        "risk_score": round(risk, 2),
        "premium": round(premium),
        "payout_cap": round(payout_cap)
    }

@app.route("/predict-premium", methods=["POST"])
def predict():
    data = request.json
    result = calculate_insurance(data)
    return jsonify(result)

if __name__ == "__main__":
    app.run(port=5001)