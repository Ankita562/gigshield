import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  userId: String,
  amount: Number,
  status: { type: String, default: "approved" },
  reason: String
},{timestamps:true});

export default mongoose.model("Claim", claimSchema);