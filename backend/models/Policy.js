import mongoose from "mongoose";

const policySchema = new mongoose.Schema({
  // 1. Teammate's robust User Reference
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // 2. Your specific UI/Legal additions
  uin: { type: String, default: "IRDAI-33752" }, 
  zone: { 
    type: String, 
    required: true, 
    enum: ['Koramangala', 'HSR Layout', 'Indiranagar'] 
  },
  
  planType: { type: String, enum: ["Basic", "Standard", "Premium"], required: true },
  amount: { type: Number, required: true }, // Note: We use their 'amount' instead of your 'premium' so Razorpay routes don't break
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String, required: true },
  
  // 4. Time & Status
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["active", "expired", "cancelled"], 
    default: "active",
    lowercase: true 
  }
}, { timestamps: true });


const Policy = mongoose.model('Policy', policySchema);
export default Policy;