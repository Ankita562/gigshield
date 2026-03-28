import { MobileLayout } from '../components/MobileLayout';
import { Shield, Check, Sparkles, TrendingUp, Zap, AlertCircle, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type PlanTier = 'basic' | 'standard' | 'premium';

export function PremiumSelection() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>('standard');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const plans = {
    basic: {
      name: 'Basic Shield',
      price: 30,
      popular: false,
      color: 'from-[#8da9c4] to-[#134074]',
      features: [
        { text: 'Rainfall protection (>40mm)', included: true },
        { text: 'AQI protection (>300)', included: true },
        { text: 'Max payout: ₹400 per event', included: true },
        { text: 'Unlimited weekly events', included: true },
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
      features: [
        { text: 'Rainfall protection (>40mm)', included: true },
        { text: 'AQI protection (>300)', included: true },
        { text: 'Max payout: ₹600 per event', included: true },
        { text: 'Unlimited weekly events', included: true },
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
      features: [
        { text: 'Rainfall protection (>35mm)', included: true },
        { text: 'AQI protection (>250)', included: true },
        { text: 'Max payout: ₹1000 per event', included: true },
        { text: 'Unlimited weekly events', included: true },
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

  const handlePurchase = () => {
    setShowConfirmation(true);
    // Simulate purchase process
    setTimeout(() => {
      navigate('/policy');
    }, 2500);
  };

  if (showConfirmation) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-gradient-to-br from-[#eef4ed] to-[#8da9c4]/20 flex items-center justify-center px-6">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-[#8da9c4]/40 text-center max-w-sm">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-bold text-[#0b2545] mb-2">Policy Activated!</h2>
            <p className="text-[#13315c] mb-4">
              Your {plans[selectedPlan].name} is now active. You're protected 24/7.
            </p>
            <div className="bg-[#eef4ed] rounded-xl p-4 border border-[#8da9c4]/40">
              <p className="text-sm text-[#13315c]/70 mb-1">Weekly Premium</p>
              <p className="text-3xl font-bold text-[#134074]">₹{plans[selectedPlan].price}</p>
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      {/* Header */}
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

      {/* Plan Cards */}
      <div className="px-6 -mt-12 mb-6 space-y-4 relative z-20">
        {(Object.keys(plans) as PlanTier[]).map((planKey) => {
          const plan = plans[planKey];
          return (
            <div
              key={planKey}
              onClick={() => setSelectedPlan(planKey)}
              className={`relative rounded-2xl overflow-hidden transition-all cursor-pointer ${
                selectedPlan === planKey
                  ? 'ring-4 ring-[#134074] shadow-2xl scale-[1.02]'
                  : 'shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Card Header */}
              <div className={`bg-gradient-to-br ${plan.color} text-white p-6 pb-8`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                    <p className="text-sm text-white/80">Comprehensive protection</p>
                  </div>
                  {selectedPlan === planKey && (
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-[#134074]" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">₹{plan.price}</span>
                  <span className="text-white/80 text-sm">/week</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="bg-[#eef4ed] p-6">
                {/* Trigger Info */}
                <div className="mb-5 bg-white/60 rounded-xl p-4 border border-[#8da9c4]/40">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-[#134074]" strokeWidth={2.5} />
                    <span className="text-xs font-bold text-[#134074] uppercase tracking-wide">Auto-Payout Triggers</span>
                  </div>
                  <div className="space-y-1">
                    {plan.triggers.map((trigger, idx) => (
                      <p key={idx} className="text-xs text-[#13315c] font-medium">• {trigger}</p>
                    ))}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
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

      {/* Benefits Section */}
      <div className="px-6 mb-6">
        <div className="bg-[#8da9c4]/20 rounded-2xl p-5 border border-[#8da9c4]/50">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 bg-[#134074] rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-[#0b2545] mb-2 text-base">Why Choose GigShield?</p>
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
                  <span className="text-[#13315c]"><span className="font-bold">Unlimited events</span> - No cap on monthly claims</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-[#134074] rounded-full"></div>
                  <span className="text-[#13315c]"><span className="font-bold">Cancel anytime</span> - 30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* IRDAI Compliance Notice */}
      <div className="px-6 mb-6">
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <div>
            <p className="text-sm text-emerald-900 font-semibold mb-1">IRDAI Registered Insurance</p>
            <p className="text-xs text-emerald-800 leading-relaxed">
              GigShield is a parametric insurance product approved by the Insurance Regulatory and Development Authority of India. Your policy is legally protected.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="px-6 mb-8">
        <button
          onClick={handlePurchase}
          className="w-full bg-gradient-to-r from-[#134074] to-[#0b2545] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-3 group"
        >
          <Shield className="w-6 h-6" strokeWidth={2.5} />
          Activate {plans[selectedPlan].name}
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
        </button>
        <p className="text-center text-xs text-[#13315c]/60 mt-3">
          ₹{plans[selectedPlan].price}/week • Cancel anytime • No hidden fees
        </p>
      </div>

      {/* Important Note */}
      <div className="px-6 mb-6">
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <div>
            <p className="text-sm text-amber-900 leading-relaxed">
              <span className="font-semibold">Free Look Period:</span> Try risk-free for 30 days. Full refund if you're not satisfied. No questions asked.
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
