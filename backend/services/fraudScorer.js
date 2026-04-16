// fraudScorer.js — drop this into your Node.js backend
// Called when a worker submits a claim

const FRAUD_SERVICE_URL = process.env.FRAUD_SERVICE_URL || 'http://localhost:8000';

/**
 * Score a claim for fraud.
 * Call this right after your claim validation, before writing to DB.
 *
 * @param {Object} claim     - claim data from the app
 * @param {Object} telemetry - computed telemetry signals
 * @param {Object} weather   - data from Open-Meteo API
 * @param {Object} worker    - worker profile from your DB
 * @returns {Object} { fraud_score, verdict, flags }
 */
async function scoreClaim(claim, telemetry, weather, worker) {
  console.log("🔥🔥 FRAUD SCORER CALLED 🔥🔥");
  const ts = new Date();
  const payload = {
    velocity_kmh: Number(telemetry.velocityKmh || 0),
  device_accounts_today: Number(telemetry.deviceAccountsToday || 1),
  weather_matches_claim: Boolean(telemetry.weatherMatchesClaim),

  claim_type: claim.type,
  claim_amount_inr: Number(claim.amountInr),
  photo_submitted: Boolean(claim.hasPhoto),

  days_since_joining: Number(worker.daysSinceJoining || 1),
  claims_last_30_days: Number(worker.claimsLast30Days || 0),
  worker_age: Number(worker.age || 25),

  actual_rainfall_mm: Number(weather.rainfallMm || 0),
  actual_aqi: Number(weather.aqi || 50),
  actual_temp_c: Number(weather.tempC || 28),
  claimed_aqi_severe: false,

  hour_of_day: ts.getHours(),   // ✅ use it here
  day_of_week: ts.getDay(),

  mins_since_shift_start: Number(telemetry.minsSinceShiftStart || 0),
  zone_claims_last_hour: Number(telemetry.zoneClaimsLastHour || 0),
  zone: claim.zone
  };
  const res = await fetch(`${FRAUD_SERVICE_URL}/score`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});

let data;

try {
  data = await res.json();
} catch (e) {
  console.error("❌ Failed to parse JSON:", e);
  throw new Error("Invalid response from ML service");
}

if (!res.ok) {
  console.error("❌ FASTAPI ERROR:", data);
  throw new Error(`Fraud service error: ${res.status}`);
}
console.log("✅ ML RESPONSE:", data);
return data; // ✅ ALWAYS returns
  // Returns: { fraud_score: 0.82, verdict: 'reject', flags: ['duplicate_device'], ml_score: 0.67, telemetry_boost: 0.15 }
}


// ── Example usage in your Express claim handler ───────────────────────────────

// router.post('/claims', async (req, res) => {
//   const { claim, deviceId, gpsCoords } = req.body;
//   const worker = await db.getWorker(req.user.id);
//
//   // 1. Compute telemetry
//   const telemetry = {
//     velocityKmh:           computeVelocity(worker.lastLocation, gpsCoords, claim.timestamp),
//     deviceAccountsToday:   await db.countAccountsForDevice(deviceId),
//     weatherMatchesClaim:   await checkWeather(claim.zone, claim.type),
//     minsSinceShiftStart:   (Date.now() - worker.shiftStartTs) / 60000,
//     zoneClaimsLastHour:    await db.countZoneClaims(claim.zone, 60),
//   };
//
//   // 2. Get weather context
//   const weather = await fetchOpenMeteo(claim.zone);
//
//   // 3. Score
//   const result = await scoreClaim(claim, telemetry, weather, worker);
//
//   // 4. Route based on verdict
//   if (result.verdict === 'reject') {
//     return res.status(200).json({ status: 'rejected', reason: result.flags });
//   }
//   if (result.verdict === 'review') {
//     await db.addToReviewQueue(claim, result);
//     return res.status(200).json({ status: 'under_review' });
//   }
//   await db.approveClaim(claim);
//   return res.status(200).json({ status: 'approved' });
// });

module.exports = { scoreClaim };