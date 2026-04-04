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

  const lastClaim = await Claim.findOne({ userId }).sort({ createdAt: -1 });

    if (lastClaim) {
      const diff = (Date.now() - lastClaim.createdAt) / (1000 * 60);
      if (diff < 60) { // 1 min for testing
        const rejected = await Claim.create({
          userId,
          amount: 0,
          reason: "Cooldown active",
          status: "rejected"
        });

         return res.json({
          message: "Claim rejected ❌",
          claim: rejected
        });
      }
    }
    // 🧠 STEP B: Check trigger
    
    if (rainfall > 40) {
      const base=200;
    const severityMultiplier=rainfall>60?2:rainfall>50?1.5:1;
    const variability=0.8+Math.random()*0.4;

    const calculated=Math.round(base*severityMultiplier*variability);
    const payout=Math.min(Math.max(calculated,150),400);
      const approved = await Claim.create({
        userId,
        amount: payout,
        reason: "Heavy Rain",
        status: "approved"
      });
      return res.json({
        message: "Claim auto-approved 🎉",
        claim: approved
      });
    }
      if(aqi>300){
        const base=200;
    const severityMultiplier=aqi>400?2:aqi>350?1.5:1;
    const variability=0.8+Math.random()*0.4;

    const calculated=Math.round(base*severityMultiplier*variability);
    const payout=Math.min(Math.max(calculated,150),400);
        const approved = await Claim.create({
           userId,
        amount: payout,
        reason: "High AQI",
        status: "approved"
      });
      return res.json({
        message: "Claim auto-approved 🎉",
        claim: approved
      });
    }

    // 🧠 STEP C: No trigger
    // const rejected = await Claim.create({
    //   userId,
    //   amount: 0,
    //   reason: "Conditions not met",
    //   status: "rejected"
    // });

    // return res.json({
    //   message: "No claim triggered",
    //   claim: rejected
    // });
    return res.json({
      message:"No claim triggered"
    });



  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//     if (rainfall > 40) {
//       reason = "Heavy Rain";
//       amount = 400;
//     } else if (aqi > 300) {
//       reason = "High AQI";
//       amount = 400;
//     }

//     if (!reason) {
//       return res.json({ message: "No claim triggered" });
//     }

//     const claim = await Claim.create({
//       userId,
//       amount,
//       reason,
//     });

//     res.json({
//       message: "Claim auto-approved 🎉",
//       claim,
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


export default router;