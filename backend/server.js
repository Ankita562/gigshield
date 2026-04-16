import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dns from "node:dns";
import jwt from "jsonwebtoken";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

import User from "./models/User.js";
import { authMiddleware } from "./middleware/auth.js";
import policyRoutes from "./routes/policy.js";
import claimRoutes from "./routes/claim.js";
import forecastRoutes from "./routes/forecast.js";
import paymentRoutes from "./routes/payments.js";
import { runConsensusEngine } from "./services/weatherService.js";
import kycRoutes from "./routes/kyc.js";

const app = express();

const requiredEnv = [
  "MONGO_URI",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "JWT_SECRET",
];

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

// ========== PUBLIC ROUTES ==========
app.use("/api/user", kycRoutes);       // KYC route (needs JSON parser)
app.use("/api/forecast", forecastRoutes);
app.use("/api/trigger-claim", claimRoutes);
app.use("/api/payments", paymentRoutes);

// ========== LOGIN (public, returns plan fields & KYC masked data) ==========
app.post("/api/login", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    const user = await User.findOne({ phone }).populate("activePolicyId");

    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up first." });
    }

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
      message: "Login successful",
      user: userResponse,
      token,
      policy: user.activePolicyId || null,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// ========== SIGNUP ==========
app.post("/api/signup", async (req, res) => {
  try {
    const { name, nominee, phone, platform_id, upi_id } = req.body;

    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      name,
      nominee,
      phone,
      platform_id,
      upi_id,
    });

    res.status(201).json({
      message: "Signup successful",
      user: newUser,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ========== PROTECTED ROUTES (require auth) ==========
app.use("/api/policies", authMiddleware, policyRoutes);
app.use("/api/claims", authMiddleware, claimRoutes);

// ========== FETCH USER POLICY (fallback) ==========
app.get("/api/user/policy", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user || !user.hasActivePlan) {
    return res.json(null);
  }
  res.json({
    isActive: true,
    planType: user.planType,
    amount: user.planPrice,
    rainThreshold: user.planThresholds?.rain,
    aqiThreshold: user.planThresholds?.aqi,
    dailyPayout: user.planThresholds?.dailyPayout
  });
});

// ========== TEST ENDPOINT ==========
app.get("/", (req, res) => {
  res.send("Backend running");
});

// ========== CONNECT TO MONGODB AND START SERVER ==========
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(5000, () => console.log("🚀 Server running on 5000"));
  })
  .catch(err => console.log(err));