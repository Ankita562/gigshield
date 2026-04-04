import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import policyRoutes from "./routes/policy.js";
import claimRoutes from "./routes/claim.js";
import "./services/weatherService.js";
import forecastRoutes from "./routes/forecast.js";

// 1. IMPORT YOUR WEATHER ENGINE
import { runConsensusEngine } from "./services/weatherService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", policyRoutes);
app.use("/api", claimRoutes);
app.use("/api",forecastRoutes);

// 2. CREATE THE BRIDGE FOR THE REACT DASHBOARD
app.get("/api/weather/check", async (req, res) => {
  try {
      console.log("⚡ React Dashboard triggered a manual Actuarial Check!");
      
      // Run your Triple-Threat logic
      const result = await runConsensusEngine();
      
      // Send the answer back to the frontend
      res.json(result); 
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Backend engine failed" });
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(5000, () => console.log("Server running on port 5000"));