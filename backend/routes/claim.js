const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const User = require('../models/User');
const { sendClaimNotification } = require('../services/notifications');
const { scoreClaim } = require('../services/fraudScorer');
const { authMiddleware } = require('../middleware/auth');

router.post('/claims', authMiddleware, async (req, res) => {  try {
    const worker = await User.findById(req.user.id);
    const { claimType, amountInr, zone, hasPhoto, gpsCoords, deviceId } = req.body;

    // --- Compute telemetry ---
    const now = Date.now();
    const shiftStart = worker.shiftStartTime || now;

    // Count how many accounts used this device today
    const deviceAccountsToday = await Claim.countDocuments({
      deviceId,
      timestamp: { $gte: new Date(Date.now() - 86400000) }
    });

    // Count zone claims in last hour
    const zoneClaimsLastHour = await Claim.countDocuments({
      zone,
      timestamp: { $gte: new Date(Date.now() - 3600000) }
    });

    // Count worker claims in last 30 days
    const claimsLast30Days = await Claim.countDocuments({
      workerId: req.user.id,
      timestamp: { $gte: new Date(Date.now() - 30 * 86400000) }
    });

    const telemetry = {
      velocityKmh:          req.body.velocityKmh || 0,
      deviceAccountsToday:  deviceAccountsToday + 1,
      weatherMatchesClaim:  req.body.weatherMatchesClaim ?? true,
      minsSinceShiftStart:  (now - shiftStart) / 60000,
      zoneClaimsLastHour,
    };

    const weather = {
      rainfallMm: req.body.actualRainfallMm || 0,
      aqi:        req.body.actualAqi || 50,
      tempC:      req.body.actualTempC || 28,
    };

    const workerProfile = {
      daysSinceJoining:  Math.floor((now - new Date(worker.createdAt)) / 86400000),
      claimsLast30Days,
      age: worker.age || 25,
    };

    const result = await scoreClaim(
  {
    type: claimType,
    amountInr,
    zone,
    hasPhoto,
    claimedAqiSevere: false,
    timestamp: Date.now()   // 🔥 ADD THIS
  },
  telemetry,
  weather,
  workerProfile
);
    // --- Save claim with fraud result ---
    const claim = await Claim.create({
      workerId:     req.user.id,
      claimType,
      amountInr,
      zone,
      hasPhoto,
      timestamp:    new Date(),
      fraudScore:   result.fraud_score,
      fraudVerdict: result.verdict,
      fraudFlags:   result.flags,
      status:       result.verdict === 'approve' ? 'approved'
                  : result.verdict === 'reject'  ? 'rejected'
                  : 'under_review',
    });

    // --- Send notification ---
    await sendClaimNotification(worker, claim, result);

    return res.json({
      status:      claim.status,
      fraudScore:  result.fraud_score,
      flags:       result.flags,
      claimId:     claim._id,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;