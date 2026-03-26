import express from "express";
import Policy from "../models/Policy.js";

const router = express.Router();

router.get("/dashboard/:userId", async (req, res) => {
  const policy = await Policy.findOne({ userId: req.params.userId });
  res.json(policy);
});

export default router;