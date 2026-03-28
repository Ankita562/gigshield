import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},
  amount: Number,
  status: { type: String, default: "approved" },
  reason: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Claim", claimSchema);