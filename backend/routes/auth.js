import express from "express";
import User from "../models/User.js";
import Policy from "../models/Policy.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, phone, location, nominee } = req.body;

  const user = await User.create({ name, phone, location, nominee });

  const policy = await Policy.create({
    userId: user._id,
    uin: "IRDAI-" + Math.floor(Math.random() * 100000),
    premium: 40
  });

  res.json({ user, policy });
});

export default router;