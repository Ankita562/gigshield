import express from 'express';
import Claim from '../models/Claim.js';
import User from '../models/User.js';
import { sendClaimNotification } from '../services/notifications.js';
import { scoreClaim } from '../services/fraudScorer.js';
import { authMiddleware } from '../middleware/auth.js';
 
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // The engine sends the workerId directly in the body
    const { workerId, claimType, amountInr, zone } = req.body;
    const worker = await User.findById(workerId);

    if (!worker) return res.status(404).json({ error: "Worker not found" });

    // 🟢 RUN THE FRAUD SCORER 
    const telemetry = { velocityKmh: req.body.velocityKmh || 0 };
    const weather = { rainfallMm: req.body.actualRainfallMm || 0 };
    
    // Call your ML scorer
    const result = await scoreClaim(
      { type: claimType, amountInr, zone: zone || 'Bengaluru' },
      telemetry,
      weather,
      { claimsLast30Days: 1 } // Mock profile data
    );

    const claim = await Claim.create({
      workerId,
      claimType: claimType || 'parametric_weather',
      amountInr,
      zone: zone || 'Bengaluru',
      timestamp: new Date(),
      fraudScore: result.fraud_score,
      fraudVerdict: result.verdict,
      fraudFlags: result.flags,
      status: result.verdict === 'approve' ? 'approved' : 'rejected'
    });

    // 🟢 BLOCK PAYOUT IF REJECTED
    if (result.verdict === 'reject') {
      console.log(`⛔ FRAUD CAUGHT! Payout Blocked for ${worker.name || worker._id}`);
      return res.json({ 
        status: 'rejected', 
        claimId: claim._id, 
        fraudScore: result.fraud_score,
        flags: result.flags 
      });
    }

    // 🟢 ONLY ADD MONEY IF APPROVED
    worker.walletBalance = (worker.walletBalance || 0) + amountInr;
    await worker.save(); // CRITICAL: Actually save the money to the database!

    // Fire the new notification system safely!
    try {
      await sendClaimNotification(worker, claim, { verdict: 'approve' });
    } catch (smsError) {
      console.log("⚠️ Twilio limit reached: SMS skipped, but Payout is still successful!");
    }

    return res.json({ 
      status: 'approved', 
      claimId: claim._id,
      fraudScore: result.fraud_score 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

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
    timestamp: Date.now()   // 
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

// 🟢 FETCH PAYOUTS ROUTE 
router.get('/:workerId', authMiddleware, async (req, res) => {
  try {
    // Find all claims for this specific worker and sort newest first
    const claims = await Claim.find({ workerId: req.params.workerId }).sort({ timestamp: -1 });
    
    // Send the array of claims back to the React frontend
    res.json(claims);
  } catch (err) {
    console.error("Error fetching claims:", err);
    res.status(500).json({ error: "Failed to fetch payouts" });
  }
});

export default router;