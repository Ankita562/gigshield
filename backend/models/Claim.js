const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
  workerId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  claimType:        { type: String, enum: ['rain_damage','flood','extreme_heat','poor_aqi','natural_disaster'] },
  amountInr:        Number,
  zone:             String,
  hasPhoto:         Boolean,
  timestamp:        { type: Date, default: Date.now },
  fraudScore:       Number,
  fraudVerdict:     { type: String, enum: ['approve','review','reject'] },
  fraudFlags:       [String],
  status:           { type: String, enum: ['approved','under_review','rejected'], default: 'under_review' },
});

module.exports = mongoose.model('Claim', ClaimSchema);