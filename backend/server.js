import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dns from "node:dns";
import jwt from "jsonwebtoken";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import User from "./models/User.js";
import { authMiddleware } from './middleware/auth.js';
import policyRoutes from './routes/policy.js';
import claimRoutes from './routes/claim.js';
import forecastRoutes from './routes/forecast.js';
import paymentRoutes from './routes/payments.js';
import kycRoutes from './routes/kyc.js';
import { runConsensusEngine } from "./services/weatherService.js";
const app = express();

const requiredEnv = ['MONGO_URI', 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'JWT_SECRET'];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing ${key} in .env`);
    process.exit(1);
  }
});


// ========== MIDDLEWARE (ORDER MATTERS!) ==========
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://gigkavach-inky.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());   



app.use('/api/user', kycRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/trigger-claim', claimRoutes);
app.use('/api/payments', paymentRoutes);

app.post('/api/login', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone is required' });

    const user = await User.findOne({ phone }).populate('activePolicyId');
    if (!user) return res.status(404).json({ message: 'User not found. Please sign up first.' });

    const token = jwt.sign(
      {
        id: user._id,
        phone: user.phone,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userResponse = {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      platform_id: user.platform_id,
      hasActivePlan: user.hasActivePlan,
      planType: user.planType,
      planPrice: user.planPrice,
      planThresholds: user.planThresholds,
      kycVerified: user.kycVerified,
      aadhaarMasked: user.aadhaarMasked,
      panMasked: user.panMasked,
      kycVerifiedAt: user.kycVerifiedAt,
    };

    return res.json({
      message: 'Login successful',
      user: userResponse,
      token,
      policy: user.activePolicyId || null,
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/signup', async (req, res) => {
  try {
    const { name, nominee, phone, platform_id, upi_id } = req.body;
    const existing = await User.findOne({ phone });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const newUser = await User.create({ name, nominee, phone, platform_id, upi_id });
    res.status(201).json({ message: 'Signup successful', user: newUser });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.use('/api/policy', authMiddleware, policyRoutes);
app.use('/api/claims', authMiddleware, claimRoutes);

app.get('/api/user/policy', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user || !user.hasActivePlan) return res.json(null);
  res.json({
    isActive: true,
    planType: user.planType,
    amount: user.planPrice,
    rainThreshold: user.planThresholds?.rain,
    aqiThreshold: user.planThresholds?.aqi,
    dailyPayout: user.planThresholds?.dailyPayout,
  });
});

// ========== ADMIN & ENGINE ROUTES (For the Dashboard) ==========

// 1. Feed the Actuarial Pool Health data
// 1. Feed the Actuarial Pool Health data
app.get("/api/admin/stats", async (req, res) => {
  try {
    const users = await User.find({ hasActivePlan: true });
    
    let totalPremium = 0;
    let maxExposure = 0;
    
    users.forEach(u => {
      totalPremium += (u.planPrice || 0);
      if (u.planType === 'Premium') maxExposure += 1000;
      else if (u.planType === 'Standard') maxExposure += 600;
      else maxExposure += 400; 
    });

    // Send the exact structure your new TypeScript interface expects!
    res.json({
      activePolicies: users.length,
      premiumPool: totalPremium,
      maxExposure: maxExposure,
      lossRatio: 12.5, // Hardcoded safe number for the demo
      
      // Data for your Recharts BarChart
      weeklyData: [
        { name: 'Mon', claims: 4 },
        { name: 'Tue', claims: 12 },
        { name: 'Wed', claims: 8 },
        { name: 'Thu', claims: 35 }, // Simulate a storm hit here!
        { name: 'Fri', claims: 15 },
        { name: 'Sat', claims: 5 },
        { name: 'Sun', claims: 2 }
      ],
      
      // Data for your Claims Summary Card
      claimsSummary: { 
        triggered: 81, 
        paid: 32400, 
        approved: 78, 
        flagged: 3 
      },
      
      // Data for your Zone Risk Heat Table
      zoneRisk: [
        { name: 'Koramangala', risk: 'High', policies: Math.floor(users.length * 0.4) },
        { name: 'HSR Layout', risk: 'Medium', policies: Math.floor(users.length * 0.35) },
        { name: 'Indiranagar', risk: 'Low', policies: Math.floor(users.length * 0.25) }
      ],

      // Data for your Live Fraud Engine Decisions
      fraudAlerts: [
        { claimId: 'CLM-8921', score: 88, status: 'Flagged', reasons: ['Speed > 65km/h', 'Device ID Mismatch'] },
        { claimId: 'CLM-8922', score: 12, status: 'Clean', reasons: ['Verified Rain', 'Consistent GPS'] },
        { claimId: 'CLM-8923', score: 95, status: 'Flagged', reasons: ['3 Claims in 30 Days', 'No Photo Evidence'] }
      ]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

app.get("/api/weather/check", async (req, res) => {
  try {
    const mode = req.query.mode || 'live'; 
    console.log(`⚡ Admin manually triggered the Engine in ${mode.toUpperCase()} mode!`);
    const result = await runConsensusEngine(mode); 
    
    res.json({
      message: "Engine cycle complete",
      payout: result.payout,
      details: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Engine failed to run" });
  }
});

// ========== TEST ENDPOINT ==========
app.get("/", (req, res) => {
  res.send("Backend running");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(5000, () => console.log('🚀 Server running on 5000'));
  })
  .catch(err => console.log(err));