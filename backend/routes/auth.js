import express from "express";
import User from "../models/User.js";
import Policy from "../models/Policy.js";

const router = express.Router();


router.post("/register", async (req, res) => {
  const { name, phone, platform_id,upi_id,nominee } = req.body;
console.log("req.body");
  // 🔴 check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists. Please login." });
    }

  const user = await User.create({ name, phone, platform_id, upi_id, nominee });

  const pricingRes = await fetch("http://127.0.0.1:5001/predict-premium", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        rain_mm: 20,
        wind_speed: 10,
        temperature: 32,
        strike: 0,
        distance_km: 50,
        deliveries_per_day: 20,
        experience_months: 10,
        night_shift: 1
      })
    });

    const pricing = await pricingRes.json();

  const policy = await Policy.create({
    userId: user._id,
     premium: pricing.premium,
  payoutCap: pricing.payout_cap,
  riskScore: pricing.risk_score,
    uin: "IRDAI-" + Math.floor(Math.random() * 100000),
    weeklyPremium: 40,
    active:true
  });
  
 return res.status(200).json({ user, policy });
});

router.post("/login",async(req,res)=>{
  try{
    const {phone}=req.body;
     const user = await User.findOne({ phone });
      if (!user) {
      return res.status(404).json({ message: "User not found. Please register." });
    }
    const policy = await Policy.findOne({ userId: user._id });
    res.status(200).json({ user, policy });
  }
  catch(error){
    res.status(500).json({error:error.message});
  }
});
export default router;