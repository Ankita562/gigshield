import express from 'express';
import Policy from '../models/Policy.js';
import Claim from '../models/Claim.js';

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
      zone: req.body.zone,
      status: "active",
      uin: "IRDAI-23817"
    });
  }

  res.json(policy);
}); 

router.get("/dashboard/:userId", async (req, res) => {
  const policy = await Policy.findOne({ userId: req.params.userId });
  if (!policy) {
      return res.json({ 
        message: "No policy found", 
        todayWeather, 
        weeklyPremium: 0 
      });
    }

  const todayWeather = {
    rainfall: Math.floor(Math.random() * 50),
    aqi: Math.floor(Math.random() * 300),
    temp: 25 + Math.floor(Math.random() * 10)
  };

  res.json({ ...policy._doc, weeklyPremium: policy.premium, todayWeather });
});

// 🟢 FETCH POLICY ROUTE (Fixes the 404)
router.get('/:userId', async (req, res) => {
  try {
    // Find the active policy for this user
    const policy = await Policy.findOne({ 
      userId: req.params.userId, 
      isActive: true 
    });
    if (!policy) {
      return res.json({ message: "No active policy found", policy: null });
    }
    
    res.json({ policy });
  } catch (err) {
    console.error("Error fetching policy:", err);
    res.status(500).json({ error: "Failed to fetch policy" });
  }
});

export default router;