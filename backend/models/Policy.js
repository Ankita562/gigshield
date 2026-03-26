import mongoose from "mongoose";

const policySchema = new mongoose.Schema({
  userId: String,
  uin: String,
  premium: Number,
  status: { type: String, default: "active" }
});

export default mongoose.model("Policy", policySchema);