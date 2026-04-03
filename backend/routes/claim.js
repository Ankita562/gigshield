import express from "express";
import Policy from "../models/Policy.js";
import Claim from "../models/Claim.js";
import mongoose from "mongoose";
const router = express.Router();
router.get("/dashboard/:userId", async (req, res) => {
  const policy = await Policy.findOne({ userId:req.params.userId });
  res.json(policy);
});

router.get("/claims/:userId", async (req, res) => {
  try {
    const claims = await Claim.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/trigger-claim", async (req, res) => {
  try {
    const { userId, rainfall, aqi } = req.body;

    const policy = await Policy.findOne({ userId:userId  });

    if (!policy || policy.status!=="active") {
      return res.status(400).json({ message: "No active policy" });
    }

    let reason = null;
    let amount = 0;

    if (rainfall > 40) {
      reason = "Heavy Rain";
      amount = 400;
    } else if (aqi > 300) {
      reason = "High AQI";
      amount = 400;
    }

    if (!reason) {
      return res.json({ message: "No claim triggered" });
    }

    const claim = await Claim.create({
      userId,
      amount,
      reason,
    });

    res.json({
      message: "Claim auto-approved 🎉",
      claim,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;