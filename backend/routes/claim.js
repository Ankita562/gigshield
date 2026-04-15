import express from "express";
import Policy from "../models/Policy.js";
import Claim from "../models/Claim.js";

const router = express.Router();

// User claim history
// Final route: GET /api/claims/:userId
router.get("/:userId", async (req, res) => {
  try {
    const claims = await Claim.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User dashboard / latest policy
// Final route: GET /api/claims/dashboard/:userId
router.get("/dashboard/:userId", async (req, res) => {
  try {
    const policy = await Policy.findOne({ userId: req.params.userId });
    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Internal weather-engine trigger
// IMPORTANT:
// If mounted with app.use("/api/trigger-claim", claimRoutes)
// then this must be "/"
router.post("/", async (req, res) => {
  try {
    const { userId, rainfall = 0, aqi = 0 } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const policy = await Policy.findOne({ userId });

    if (!policy || policy.status !== "active") {
      return res.status(400).json({ message: "No active policy" });
    }

    const lastClaim = await Claim.findOne({ userId }).sort({ createdAt: -1 });

    if (lastClaim) {
      const diff = (Date.now() - new Date(lastClaim.createdAt).getTime()) / (1000 * 60);

      if (diff < 60) {
        const rejected = await Claim.create({
          userId,
          amount: 0,
          reason: "Cooldown active",
          status: "rejected",
        });

        return res.json({
          message: "Claim rejected ❌",
          claim: rejected,
        });
      }
    }

    if (rainfall > 40) {
      const base = 200;
      const severityMultiplier = rainfall > 60 ? 2 : rainfall > 50 ? 1.5 : 1;
      const variability = 0.8 + Math.random() * 0.4;
      const calculated = Math.round(base * severityMultiplier * variability);
      const payout = Math.min(Math.max(calculated, 150), 400);

      const approved = await Claim.create({
        userId,
        amount: payout,
        reason: "Heavy Rain",
        status: "approved",
      });

      return res.json({
        message: "Claim auto-approved 🎉",
        claim: approved,
      });
    }

    if (aqi > 300) {
      const base = 200;
      const severityMultiplier = aqi > 400 ? 2 : aqi > 350 ? 1.5 : 1;
      const variability = 0.8 + Math.random() * 0.4;
      const calculated = Math.round(base * severityMultiplier * variability);
      const payout = Math.min(Math.max(calculated, 150), 400);

      const approved = await Claim.create({
        userId,
        amount: payout,
        reason: "High AQI",
        status: "approved",
      });

      return res.json({
        message: "Claim auto-approved 🎉",
        claim: approved,
      });
    }

    return res.json({
      message: "No claim triggered",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;