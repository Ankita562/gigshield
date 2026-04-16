const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.post('/verify-kyc', authMiddleware, async (req, res) => {
  try {
    const { aadhaar, pan } = req.body;
    const userId = req.user.id;

    if (!/^\d{12}$/.test(aadhaar))
      return res.status(400).json({ message: 'Aadhaar must be 12 digits' });
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan))
      return res.status(400).json({ message: 'PAN must be 10 characters (e.g., ABCDE1234F)' });

    const aadhaarMasked = 'XXXXXXXX' + aadhaar.slice(-4);
    const panMasked = pan.slice(0, 4) + '****' + pan.slice(-1);

    const user = await User.findByIdAndUpdate(userId, {
      kycVerified: true, aadhaarMasked, panMasked, kycVerifiedAt: new Date(),
    }, { new: true });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      success: true,
      user: {
        id: user._id, name: user.name, phone: user.phone,
        kycVerified: user.kycVerified, aadhaarMasked: user.aadhaarMasked,
        panMasked: user.panMasked, hasActivePlan: user.hasActivePlan,
        planType: user.planType,
      },
    });
  } catch (error) {
    console.error('KYC error:', error);
    res.status(500).json({ message: 'Server error during KYC verification' });
  }
});

module.exports = router;