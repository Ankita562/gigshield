import express from "express";
import Policy from "../models/Policy.js";
import mongoose from "mongoose";
import Claim from "../models/Claim.js";
const router = express.Router();

router.post("/policy/buy", async (req, res) => {
  const { userId, premium } = req.body;

  let policy = await Policy.findOne({ userId });

  if (policy) {
    policy.premium = premium;
    policy.status = "active";
    await policy.save();
  } else {
    policy = await Policy.create({
      userId,
      premium,
      status: "active",
      uin: "IRDAI-23817"
    });
  }

  res.json(policy);
});

router.get("/dashboard/:userId", async (req, res) => {
  const policy = await Policy.findOne({ userId:req.params.userId });
   if (!policy) {
    return res.status(404).json({ message: "No policy found" });
  }

  // 🔥 dynamic weather (for demo)
  const todayWeather = {
    rainfall: Math.floor(Math.random() * 50),
    aqi: Math.floor(Math.random() * 300),
    temp: 25 + Math.floor(Math.random() * 10)
  };
  res.json({...policy._doc,weeklyPremium:policy.premium,todayWeather});
});

export default router;