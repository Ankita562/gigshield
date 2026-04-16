const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  phone: { type: String, required: true, unique: true },
  location: { type: String, default: "Koramangala, Bengaluru" },
  nominee: { type: String, default: "" },
  platform_id: { type: String, unique: true },
  upi_id: { type: String, default: "" },

  hasActivePlan: { type: Boolean, default: false },
  planType: { type: String, enum: ["Basic", "Standard", "Premium"], default: null },
  planPrice: { type: Number, default: null },

  planThresholds: {
    rain: { type: Number, default: null },
    aqi: { type: Number, default: null },
    dailyPayout: { type: Number, default: null }
  },

  activePolicyId: { type: mongoose.Schema.Types.ObjectId, ref: "Policy" },
  subscriptionStartDate: { type: Date, default: null },
  subscriptionEndDate: { type: Date, default: null },

  kycVerified: { type: Boolean, default: false },
  aadhaarMasked: { type: String, default: null },
  panMasked: { type: String, default: null },
  kycVerifiedAt: { type: Date, default: null }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);