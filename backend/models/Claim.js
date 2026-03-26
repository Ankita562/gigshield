import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  userId: String,
  amount: Number,
  status: { type: String, default: "approved" },
  reason: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Claim", claimSchema);