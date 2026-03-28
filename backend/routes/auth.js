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

  const policy = await Policy.create({
    userId: user._id,
    uin: "IRDAI-" + Math.floor(Math.random() * 100000),
    weeklyPremium: 40,
    active:true
  });
  
  res.status(200).json({ user, policy });
  res.json({ user, policy });
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