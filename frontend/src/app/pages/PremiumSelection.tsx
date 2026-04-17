/// <reference types="vite/client" />
import { Check, Zap, ArrowRight, Loader2, Info, Shield, Sparkles, TrendingUp, AlertCircle, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "../components/MobileLayout";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE } from "../../config";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type PlanTier = "basic" | "standard" | "premium";

export function PremiumSelection() {
  const navigate = useNavigate();
  const { user: authUser, token: authToken } = useAuth();
  const [activeTab, setActiveTab] = useState<PlanTier>("standard");
  const [agreed, setAgreed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [subscribedPlan, setSubscribedPlan] = useState("");

  // ✅ KYC Guard – IRDAI compliance: redirect if not verified
  useEffect(() => {
    const kycVerified = localStorage.getItem("kycVerified");
    if (kycVerified !== "true") {
      navigate("/verify-identity", { replace: true });
    }
  }, [navigate]);

  // Plan data
  const planData = {
    basic: {
      name: 'Basic Shield', // Capitalized for the UI
      price: 30,
      popular: false,
      color: 'from-[#8da9c4] to-[#134074]',
      // Added Actuarial Data below to fix the TypeScript errors!
      rain: 40,
      aqi: 300,
      payout: 400,
      features: [
        { text: 'Rainfall protection (>40mm)', included: true },
        { text: 'AQI protection (>300)', included: true },
        { text: 'Up to ₹400 per event (Dynamic)', included: true },
        { text: 'Up to 2 payouts per week', included: true },
        { text: 'Heat wave protection', included: false },
        { text: 'Storm protection', included: false },
        { text: 'Priority claim processing', included: false },
        { text: 'Premium lock guarantee', included: false },
      ],
      triggers: [
        'Rainfall > 40mm in 24hrs → ₹400',
        'AQI > 300 → ₹400',
      ],
    },
    standard: {
      name: 'Standard Shield',
      price: 45,
      popular: true,
      color: 'from-[#134074] to-[#0b2545]',
      // Added Actuarial Data!
      rain: 40, 
      aqi: 300,
      payout: 600,
      features: [
        { text: 'Rainfall protection (>40mm)', included: true },
        { text: 'AQI protection (>300)', included: true },
        { text: 'Up to ₹600 per event (Dynamic)', included: true },
        { text: 'Up to 2 payouts per week', included: true },
        { text: 'Heat wave protection (≥40°C)', included: true },
        { text: 'Storm protection (>55km/h)', included: true },
        { text: 'Priority claim processing', included: false },
        { text: 'Premium lock guarantee', included: false },
      ],
      triggers: [
        'Rainfall > 40mm in 24hrs → ₹600',
        'AQI > 300 → ₹600',
        'Temperature ≥ 40°C → ₹600',
        'Wind > 55km/h → ₹600',
      ],
    },
    premium: {
      name: 'Premium Shield',
      price: 70,
      popular: false,
      color: 'from-[#0b2545] via-[#13315c] to-[#134074]',
      // Added Actuarial Data!
      rain: 35,
      aqi: 250,
      payout: 1000,
      features: [
        { text: 'Rainfall protection (>35mm)', included: true },
        { text: 'AQI protection (>250)', included: true },
        { text: 'Up to ₹1000 per event (Dynamic)', included: true },
        { text: 'Up to 3 payouts per week', included: true },
        { text: 'Heat wave protection (≥38°C)', included: true },
        { text: 'Storm protection (>45km/h)', included: true },
        { text: 'Priority claim processing (<3 mins)', included: true },
        { text: 'Premium lock guarantee (6 weeks)', included: true },
      ],
      triggers: [
        'Rainfall > 35mm in 24hrs → ₹1000',
        'AQI > 250 → ₹1000',
        'Temperature ≥ 38°C → ₹1000',
        'Wind > 45km/h → ₹1000',
      ],
    },
  };

  const current = planData[activeTab];
  const currentUser = authUser || JSON.parse(localStorage.getItem("gigshield_user") || "null");
  const currentToken = authToken || localStorage.getItem("token");

  // Features mapping
  const getFeatures = (plan: PlanTier) => {
    const features = {
      basic: [
        { text: "Rainfall protection (>40mm)", included: true },
        { text: "AQI protection (>300)", included: true },
        { text: `Max payout: ₹${planData.basic.payout} per event`, included: true },
        { text: "Unlimited weekly events", included: true },
        { text: "Heat wave protection", included: false },
        { text: "Storm protection", included: false },
        { text: "Priority claim processing", included: false },
        { text: "premium lock guarantee", included: false },
      ],
      standard: [
        { text: "Rainfall protection (>40mm)", included: true },
        { text: "AQI protection (>300)", included: true },
        { text: `Max payout: ₹${planData.standard.payout} per event`, included: true },
        { text: "Unlimited weekly events", included: true },
        { text: "Heat wave protection (≥40°C)", included: true },
        { text: "Storm protection (>55km/h)", included: true },
        { text: "Priority claim processing", included: false },
        { text: "premium lock guarantee", included: false },
      ],
      premium: [
        { text: "Rainfall protection (>35mm)", included: true },
        { text: "AQI protection (>250)", included: true },
        { text: `Max payout: ₹${planData.premium.payout} per event`, included: true },
        { text: "Unlimited weekly events", included: true },
        { text: "Heat wave protection (≥38°C)", included: true },
        { text: "Storm protection (>45km/h)", included: true },
        { text: "Priority claim processing (<3 mins)", included: true },
        { text: "premium lock guarantee (6 weeks)", included: true },
      ],
    };
    return features[plan];
  };

  const getTriggers = (plan: PlanTier) => {
    const triggers = {
      basic: [
        `Rainfall > ${planData.basic.rain}mm in 24hrs → ₹${planData.basic.payout}`,
        `AQI > ${planData.basic.aqi} → ₹${planData.basic.payout}`,
      ],
      standard: [
        `Rainfall > ${planData.standard.rain}mm in 24hrs → ₹${planData.standard.payout}`,
        `AQI > ${planData.standard.aqi} → ₹${planData.standard.payout}`,
        "Temperature ≥ 40°C → ₹600",
        "Wind > 55km/h → ₹600",
      ],
      premium: [
        `Rainfall > ${planData.premium.rain}mm in 24hrs → ₹${planData.premium.payout}`,
        `AQI > ${planData.premium.aqi} → ₹${planData.premium.payout}`,
        "Temperature ≥ 38°C → ₹1000",
        "Wind > 45km/h → ₹1000",
      ],
    };
    return triggers[plan];
  };

  // Load Razorpay SDK
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (!agreed) {
      alert("Please agree to the Terms & Conditions");
      return;
    }
    setIsProcessing(true);

    try {
      // 1. Create order on backend
      const orderRes = await fetch(`${API_BASE}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: current.price * 100, planType: activeTab }),
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        if (orderRes.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }
        throw new Error(errorData.message || "Order creation failed");
      }

      const orderData = await orderRes.json();
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error("Razorpay key not configured. Check your .env file.");
      }

      // 2. Open Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: "INR",
        name: "GigKavach",
        description: `${activeTab} Shield Activation`,
        order_id: orderData.orderId,
        theme: { color: "#13315C" },
        prefill: {
          name: currentUser.name,
          contact: currentUser.phone,
        },
        handler: async (response: any) => {
          // 3. Verify payment on backend
          const verifyRes = await fetch(`${API_BASE}/api/payments/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planType: activeTab,
              amount: current.price,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            // Update localStorage with new user data (includes plan)
            const existingUser = JSON.parse(localStorage.getItem("gigshield_user") || "{}");
            const updatedUser = {
              ...existingUser,
              ...verifyData.user,
              hasActivePlan: true,
              planType: activeTab,
              planPrice: current.price,
              planThresholds: {
                rain: current.rain,
                aqi: current.aqi,
                dailyPayout: current.payout,
              },
            };
            localStorage.setItem("gigshield_user", JSON.stringify(updatedUser));
            localStorage.setItem("gigshield_policy", JSON.stringify({
              isActive: true,
              planType: activeTab,
              amount: current.price,
              rainThreshold: current.rain,
              aqiThreshold: current.aqi,
              dailyPayout: current.payout,
            }));

            setSubscribedPlan(activeTab);
            setPaymentSuccess(true);
          } else {
            throw new Error(verifyData.message || "Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      alert(`Payment failed: ${err.message}`);
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-gradient-to-br from-[#eef4ed] to-[#8da9c4]/20 flex items-center justify-center px-6">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-[#8da9c4]/40 text-center max-w-sm">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-bold text-[#0b2545] mb-2">Shield Active!</h2>
            <p className="text-[#13315c] mb-4">
              Your {current.name} is now active. You're protected 24/7.
            </p>
            <div className="bg-[#eef4ed] rounded-xl p-4 border border-[#8da9c4]/40">
              <p className="text-sm text-[#13315c]/70 mb-1">Weekly premium</p>
              <p className="text-3xl font-bold text-[#134074]">₹{current.price}</p>
            </div>
            <button
              onClick={() => navigate("/home")}
              className="mt-6 w-full bg-[#134074] text-white py-3 rounded-xl font-bold"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="relative bg-gradient-to-br from-[#134074] via-[#13315c] to-[#0b2545] text-white px-6 pt-12 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8da9c4] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0b2545] rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Choose Your Shield</h1>
          </div>
          <p className="text-[#8da9c4] text-sm ml-1">Select the coverage that protects your income</p>
        </div>
      </div>

      <div className="px-6 -mt-12 mb-6 space-y-4 relative z-20">
        {(["basic", "standard", "premium"] as const).map((planKey) => {
          const plan = planData[planKey];
          const features = getFeatures(planKey);
          const triggers = getTriggers(planKey);
          return (
            <div
              key={planKey}
              onClick={() => setActiveTab(planKey)}
              className={`relative rounded-2xl overflow-hidden transition-all cursor-pointer ${
                activeTab === planKey
                  ? 'ring-4 ring-[#134074] shadow-2xl scale-[1.02]'
                  : 'shadow-lg hover:shadow-xl'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`bg-gradient-to-br ${plan.color} text-white p-6 pb-8`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                    <p className="text-sm text-white/80">Comprehensive protection</p>
                  </div>
                  {activeTab === planKey && (
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-[#134074]" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">₹{plan.price}</span>
                  <span className="text-white/80 text-sm">/week + 18% GST added at checkout</span>
                </div>
              </div>

              <div className="bg-[#eef4ed] p-6">
                <div className="mb-5 bg-white/60 rounded-xl p-4 border border-[#8da9c4]/40">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-[#134074]" strokeWidth={2.5} />
                    <span className="text-xs font-bold text-[#134074] uppercase tracking-wide">Auto-Payout Triggers</span>
                  </div>
                  <div className="space-y-1">
                    {triggers.map((trigger, idx) => (
                      <p key={idx} className="text-xs text-[#13315c] font-medium">• {trigger}</p>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-gray-400 text-xs">×</span>
                        </div>
                      )}
                      <span className={`text-sm ${feature.included ? 'text-[#0b2545] font-medium' : 'text-[#13315c]/50'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-6 mb-6">
        <div className="bg-[#8da9c4]/20 rounded-2xl p-5 border border-[#8da9c4]/50">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 bg-[#134074] rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-[#0b2545] mb-2 text-base">Why Choose GigKavach?</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-[#134074] rounded-full"></div>
                  <span className="text-[#13315c]"><span className="font-bold">Zero-touch claims</span> - Fully automatic payouts</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-[#134074] rounded-full"></div>
                  <span className="text-[#13315c]"><span className="font-bold">Instant payouts</span> - Direct to UPI in 3-6 minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-[#134074] rounded-full"></div>
                  <span className="text-[#13315c]"><span className="font-bold">Reliable Coverage</span> - Protection for multiple severe weather events per month</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-[#134074] rounded-full"></div>
                  <span className="text-[#13315c]"><span className="font-bold">Cancel anytime</span> - Zero lock-in periods, pause your coverage whenever you want</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mb-6">
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <div>
            <p className="text-sm text-emerald-900 font-semibold mb-1">IRDAI Registered Insurance</p>
            <p className="text-xs text-emerald-800 leading-relaxed">
              GigKavach is a parametric insurance product approved by the Insurance Regulatory and Development Authority of India. Your policy is legally protected.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-4 mb-8">
        <label className="flex items-start gap-3 cursor-pointer bg-slate-100/50 p-4 rounded-2xl border border-slate-100">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-slate-300 accent-[#13315C]"
          />
          <span className="text-[10px] text-slate-500 font-bold leading-tight">
            I agree to the{' '}
            <a
              href="https://razorpay.com/terms/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[#13315C] underline cursor-pointer"
            >
              Terms & Conditions
            </a>
            . Protection starts immediately upon payment.
          </span>
        </label>

        <button
          onClick={handlePayment}
          disabled={!agreed || isProcessing}
          className="w-full bg-gradient-to-r from-[#134074] to-[#0b2545] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isProcessing ? (
            <Loader2 className="animate-spin w-6 h-6" />
          ) : (
            <>
              <Shield className="w-6 h-6" strokeWidth={2.5} />
              Activate {current.name}
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
            </>
          )}
        </button>
        <p className="text-center text-xs text-[#13315c]/60 mt-3">
          ₹{planData[activeTab].price}/week • Cancel anytime • Zero lock-in
        </p>
      </div>

      <div className="px-6 mb-6">
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <div>
            <p className="text-sm text-amber-900 leading-relaxed">
              <span className="font-semibold">Flexible Coverage:</span> Pause or stop your weekly renewals whenever you want with one click.
(Note: A standard 24-hour waiting period applies to new policies to prevent active-storm fraud).
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}