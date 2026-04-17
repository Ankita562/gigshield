import express from 'express';
import crypto from'crypto';
import Razorpay from'razorpay';
import Policy from'../models/Policy.js';
import User from'../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const planData = {
  Basic:    { price: 30, rain: 40, aqi: 300, payout: 400 },
  Standard: { price: 45, rain: 40, aqi: 300, payout: 600 },
  Premium:  { price: 70, rain: 35, aqi: 250, payout: 1000 },
};

router.get('/ping', (req, res) => {
  res.json({ ok: true, message: 'payments route working' });
});

function getRazorpayInstance() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    const { amount, planType } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0)
      return res.status(400).json({ message: 'Valid amount is required' });

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: { planType: planType || 'Standard', userId },
    });

    return res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
});

router.post('/verify', authMiddleware, async (req, res) => {
  try {
    let { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType, amount } = req.body;
    const userId = req.user.id;

    if (!process.env.RAZORPAY_KEY_SECRET)
      return res.status(500).json({ success: false, message: 'Razorpay secret missing' });

    if (planType) {
        planType = planType.charAt(0).toUpperCase() + planType.slice(1).toLowerCase();
    }
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature)
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const policy = new Policy({
      userId, planType, amount,
      zone: 'Koramangala',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      startDate, endDate, status: 'active',
    });
    await policy.save();

    const selected = planData[planType];
    if (!selected)
      return res.status(400).json({ success: false, message: 'Invalid plan type' });

    const updatedUser = await User.findByIdAndUpdate(userId, {
      $set: {
        hasActivePlan: true, planType,
        planPrice: selected.price,
        planThresholds: { rain: selected.rain, aqi: selected.aqi, dailyPayout: selected.payout },
        activePolicyId: policy._id,
        subscriptionStartDate: startDate,
        subscriptionEndDate: endDate,
      },
    }, { new: true });

    if (!updatedUser)
      return res.status(404).json({ success: false, message: 'User not found' });

    return res.json({
      success: true,
      message: 'Payment verified & policy activated',
      policyId: policy._id,
      policy: {
        _id: policy._id, active: true, planType, amount, status: 'active',
        startDate, endDate,
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
      },
      user: updatedUser,
    });
  } catch (err) {
    console.error('Verify payment error:', err);
    return res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
});

export default router;