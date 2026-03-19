import { MobileLayout } from '../components/MobileLayout';
import { CheckCircle, CloudRain, Wind, Zap, ThermometerSun, CloudDrizzle, Filter, TrendingUp, AlertCircle, Sparkles, Info } from 'lucide-react';
import { useState } from 'react';

export function Payouts() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'paid' | 'pending'>('all');

  // AI Payout Calculation System
  const calculatePayout = (
    baseAmount: number,
    severityMultiplier: number,
    rarityFactor: number,
    riskFactor: number,
    cap: { min: number; max: number }
  ) => {
    const calculated = Math.round(baseAmount * severityMultiplier * rarityFactor * riskFactor);
    return Math.min(Math.max(calculated, cap.min), cap.max);
  };

  const payouts = [
    {
      id: 'PAY-2024-0045',
      date: 'Mar 17, 2026',
      time: '9:42 AM',
      baseAmount: 100,
      severityMultiplier: 2.0,
      rarityFactor: 2.8,
      riskFactor: 1.25,
      trigger: 'Extreme Rainfall',
      triggerType: 'rain',
      value: '78mm/24hrs',
      severity: 'High',
      status: 'paid',
      upiRef: 'UPI408629891',
      processingTime: '3 mins',
      cap: { min: 350, max: 700 },
    },
    {
      id: 'PAY-2024-0046',
      date: 'Mar 18, 2026',
      time: '11:25 AM',
      baseAmount: 80,
      severityMultiplier: 1.6,
      rarityFactor: 1.7,
      riskFactor: 1.15,
      trigger: 'Heavy Rainfall',
      triggerType: 'rain',
      value: '48mm/24hrs',
      severity: 'Medium',
      status: 'pending',
      upiRef: '-',
      processingTime: 'Processing',
      cap: { min: 150, max: 350 },
    },
    {
      id: 'PAY-2024-0044',
      date: 'Mar 16, 2026',
      time: '3:15 PM',
      baseAmount: 80,
      severityMultiplier: 2.2,
      rarityFactor: 2.5,
      riskFactor: 1.3,
      trigger: 'Hazardous Air Quality',
      triggerType: 'pollution',
      value: 'AQI 412',
      severity: 'High',
      status: 'paid',
      upiRef: 'UPI408629234',
      processingTime: '4 mins',
      cap: { min: 350, max: 700 },
    },
    {
      id: 'PAY-2024-0042',
      date: 'Mar 15, 2026',
      time: '2:34 PM',
      baseAmount: 80,
      severityMultiplier: 1.8,
      rarityFactor: 1.5,
      riskFactor: 1.15,
      trigger: 'Heavy Rainfall',
      triggerType: 'rain',
      value: '52mm/24hrs',
      severity: 'Medium',
      status: 'paid',
      upiRef: 'UPI408529617',
      processingTime: '4 mins',
      cap: { min: 150, max: 350 },
    },
    {
      id: 'PAY-2024-0038',
      date: 'Mar 10, 2026',
      time: '11:18 AM',
      baseAmount: 80,
      severityMultiplier: 1.6,
      rarityFactor: 1.8,
      riskFactor: 1.2,
      trigger: 'Severe Pollution',
      triggerType: 'pollution',
      value: 'AQI 315',
      severity: 'Medium',
      status: 'paid',
      upiRef: 'UPI408429105',
      processingTime: '5 mins',
      cap: { min: 150, max: 350 },
    },
    {
      id: 'PAY-2024-0035',
      date: 'Mar 07, 2026',
      time: '1:22 PM',
      baseAmount: 60,
      severityMultiplier: 1.2,
      rarityFactor: 0.9,
      riskFactor: 1.0,
      trigger: 'Moderate Rain',
      triggerType: 'drizzle',
      value: '42mm/24hrs',
      severity: 'Low',
      status: 'paid',
      upiRef: 'UPI408328956',
      processingTime: '3 mins',
      cap: { min: 50, max: 150 },
    },
    {
      id: 'PAY-2024-0031',
      date: 'Mar 03, 2026',
      time: '4:52 PM',
      baseAmount: 80,
      severityMultiplier: 1.5,
      rarityFactor: 1.4,
      riskFactor: 1.1,
      trigger: 'Heavy Rainfall',
      triggerType: 'rain',
      value: '45mm/24hrs',
      severity: 'Medium',
      status: 'paid',
      upiRef: 'UPI408328741',
      processingTime: '4 mins',
      cap: { min: 150, max: 350 },
    },
    {
      id: 'PAY-2024-0027',
      date: 'Feb 24, 2026',
      time: '9:15 AM',
      baseAmount: 70,
      severityMultiplier: 1.7,
      rarityFactor: 1.6,
      riskFactor: 1.15,
      trigger: 'Extreme Heat',
      triggerType: 'heat',
      value: '41°C',
      severity: 'Medium',
      status: 'paid',
      upiRef: 'UPI408227892',
      processingTime: '6 mins',
      cap: { min: 150, max: 350 },
    },
    {
      id: 'PAY-2024-0024',
      date: 'Feb 18, 2026',
      time: '7:45 PM',
      baseAmount: 90,
      severityMultiplier: 2.1,
      rarityFactor: 2.2,
      riskFactor: 1.2,
      trigger: 'Severe Storm',
      triggerType: 'storm',
      value: 'Wind 65km/h',
      severity: 'High',
      status: 'paid',
      upiRef: 'UPI408127453',
      processingTime: '4 mins',
      cap: { min: 350, max: 700 },
    },
    {
      id: 'PAY-2024-0047',
      date: 'Mar 18, 2026',
      time: '2:10 PM',
      baseAmount: 70,
      severityMultiplier: 1.4,
      rarityFactor: 1.3,
      riskFactor: 1.1,
      trigger: 'Moderate Pollution',
      triggerType: 'pollution',
      value: 'AQI 285',
      severity: 'Low',
      status: 'pending',
      upiRef: '-',
      processingTime: 'Processing',
      cap: { min: 50, max: 150 },
    },
  ];

  // Calculate actual payouts with AI logic
  const payoutsWithCalculations = payouts.map(p => ({
    ...p,
    amount: calculatePayout(p.baseAmount, p.severityMultiplier, p.rarityFactor, p.riskFactor, p.cap),
  }));

  // Filter payouts based on active filter
  const filteredPayouts = payoutsWithCalculations.filter(p => {
    if (activeFilter === 'all') return true;
    return p.status === activeFilter;
  });

  const totalPaid = payoutsWithCalculations.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const thisMonthPayouts = payoutsWithCalculations.filter(p => p.date.includes('Mar') && p.status === 'paid');
  const thisMonthTotal = thisMonthPayouts.reduce((sum, p) => sum + p.amount, 0);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'rain':
        return <CloudRain className="w-5 h-5 text-[#134074]" strokeWidth={2.5} />;
      case 'pollution':
        return <Wind className="w-5 h-5 text-[#134074]" strokeWidth={2.5} />;
      case 'heat':
        return <ThermometerSun className="w-5 h-5 text-[#134074]" strokeWidth={2.5} />;
      case 'drizzle':
        return <CloudDrizzle className="w-5 h-5 text-[#134074]" strokeWidth={2.5} />;
      case 'storm':
        return <Zap className="w-5 h-5 text-[#134074]" strokeWidth={2.5} />;
      default:
        return <AlertCircle className="w-5 h-5 text-[#134074]" strokeWidth={2.5} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Low':
        return 'bg-sky-100 text-sky-700 border-sky-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getIntensityBar = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'w-full bg-rose-500';
      case 'Medium':
        return 'w-2/3 bg-amber-500';
      case 'Low':
        return 'w-1/3 bg-sky-500';
      default:
        return 'w-1/2 bg-gray-400';
    }
  };

  return (
    <MobileLayout>
      {/* Hero Header - Oxford Navy Gradient */}
      <div className="relative bg-gradient-to-br from-[#134074] via-[#13315c] to-[#0b2545] text-white px-6 pt-12 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8da9c4] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0b2545] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <CheckCircle className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Payouts</h1>
          </div>
          <p className="text-[#8da9c4] text-sm ml-1">Zero-touch automatic claims</p>
        </div>
      </div>

      {/* Summary Cards - Overlapping */}
      <div className="px-6 -mt-16 mb-6 relative z-20">
        <div className="bg-[#eef4ed] rounded-2xl shadow-2xl p-6 border border-[#8da9c4]/30 mb-4">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs text-[#13315c]/70 mb-1.5 font-medium uppercase tracking-wide">All-Time Total</p>
              <p className="text-4xl font-bold text-[#0b2545]">₹{totalPaid.toLocaleString()}</p>
              <div className="mt-2 flex items-center gap-1.5 text-emerald-600">
                <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
                <span className="text-xs font-semibold">{payouts.length} automatic payouts</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-[#134074] to-[#13315c] rounded-2xl flex items-center justify-center shadow-lg shadow-[#134074]/30">
              <CheckCircle className="w-9 h-9 text-white" strokeWidth={2.5} />
            </div>
          </div>
          
          <div className="pt-4 border-t border-[#8da9c4]/40 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#13315c]/70 font-medium mb-1">This Month</p>
              <p className="text-2xl font-bold text-[#134074]">₹{thisMonthTotal.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#13315c]/70 font-medium mb-1">Payouts</p>
              <p className="text-2xl font-bold text-[#134074]">{thisMonthPayouts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 mb-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-[#134074] text-white shadow-md'
                : 'bg-[#eef4ed] text-[#13315c] border border-[#8da9c4]/40'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('paid')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeFilter === 'paid'
                ? 'bg-[#134074] text-white shadow-md'
                : 'bg-[#eef4ed] text-[#13315c] border border-[#8da9c4]/40'
            }`}
          >
            Paid
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeFilter === 'pending'
                ? 'bg-[#134074] text-white shadow-md'
                : 'bg-[#eef4ed] text-[#13315c] border border-[#8da9c4]/40'
            }`}
          >
            Pending
          </button>
        </div>
      </div>

      <div className="px-6 mb-4">
        <h2 className="text-lg font-bold text-[#0b2545]">Recent Payouts</h2>
      </div>

      {/* Payout Cards with Enhanced Design */}
      <div className="px-6 mb-6 space-y-3">
        {filteredPayouts.map((payout) => (
          <div key={payout.id} className="bg-[#eef4ed] rounded-2xl border border-[#8da9c4]/40 overflow-hidden shadow-sm">
            {/* Header Section */}
            <div className="p-5 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-11 h-11 bg-[#8da9c4]/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    {getEventIcon(payout.triggerType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-[#0b2545] text-base">{payout.trigger}</p>
                    </div>
                    <p className="text-xs text-[#13315c]/60">{payout.date} • {payout.time}</p>
                  </div>
                </div>
                <div className="text-right ml-3">
                  <p className="text-2xl font-bold text-emerald-600">+₹{payout.amount}</p>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    {payout.status === 'paid' ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
                        <span className="text-xs font-semibold text-emerald-600">Paid</span>
                      </>
                    ) : (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs font-semibold text-amber-600">Processing</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Severity Badge & Intensity Bar */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${getSeverityColor(payout.severity)}`}>
                  {payout.severity} Severity
                </div>
                <div className="flex-1 h-2 bg-[#8da9c4]/20 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${getIntensityBar(payout.severity)}`}></div>
                </div>
              </div>

              {/* Trigger Value Display */}
              <div className="bg-[#8da9c4]/15 rounded-xl p-3 border border-[#8da9c4]/30 mb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#13315c]/70 font-medium mb-0.5">Trigger Value</p>
                    <p className="text-lg font-bold text-[#134074]">{payout.value}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#13315c]/70 font-medium mb-0.5">Processing Time</p>
                    <p className="text-sm font-bold text-[#0b2545]">{payout.processingTime}</p>
                  </div>
                </div>
              </div>

              {/* AI Calculation Breakdown */}
              <div className="bg-gradient-to-r from-[#134074]/5 to-[#13315c]/5 rounded-xl p-3 border border-[#134074]/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#134074]" strokeWidth={2.5} />
                  <span className="text-xs font-bold text-[#134074]">AI Calculated Payout</span>
                  <div className="group relative">
                    <Info className="w-3.5 h-3.5 text-[#13315c]/60 cursor-help" strokeWidth={2} />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-56 bg-[#0b2545] text-white text-xs rounded-lg p-2.5 shadow-xl z-10">
                      <p className="leading-relaxed">Payout dynamically calculated based on environmental risk severity, event rarity, and your exposure level.</p>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-[#13315c]/80 font-mono leading-relaxed">
                  <span className="text-[#0b2545] font-semibold">Base ₹{payout.baseAmount}</span>
                  <span className="text-[#13315c]/60"> × </span>
                  <span className="text-[#0b2545] font-semibold">Severity {payout.severityMultiplier}×</span>
                  <span className="text-[#13315c]/60"> × </span>
                  <span className="text-[#0b2545] font-semibold">Rarity {payout.rarityFactor}×</span>
                  <span className="text-[#13315c]/60"> × </span>
                  <span className="text-[#0b2545] font-semibold">Risk {payout.riskFactor}×</span>
                </div>
                <div className="mt-2 pt-2 border-t border-[#8da9c4]/30 flex items-center justify-between">
                  <span className="text-xs text-[#13315c]/70">Capped Range:</span>
                  <span className="text-xs font-bold text-[#134074]">₹{payout.cap.min}–₹{payout.cap.max}</span>
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <div className="bg-[#8da9c4]/10 px-5 py-3 border-t border-[#8da9c4]/30">
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div>
                  <p className="text-xs text-[#13315c]/70 font-medium mb-0.5">Payout ID</p>
                  <p className="text-xs font-mono text-[#0b2545]">{payout.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#13315c]/70 font-medium mb-0.5">UPI Reference</p>
                  <p className="text-xs font-mono text-[#0b2545]">{payout.upiRef}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How It Works Section */}
      <div className="px-6 mb-6">
        <div className="bg-[#8da9c4]/20 rounded-2xl p-5 border border-[#8da9c4]/50">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 bg-[#134074] rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-[#0b2545] mb-2 text-base">Auto-Payout System</p>
              <p className="text-sm text-[#13315c] leading-relaxed mb-3">
                GigShield monitors weather & AQI 24/7. When thresholds are breached in your area, you get auto-paid to your UPI instantly.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-1.5 h-1.5 bg-[#134074] rounded-full"></div>
                  <span className="text-[#13315c]"><span className="font-bold">No claims</span> - Fully automated</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-1.5 h-1.5 bg-[#134074] rounded-full"></div>
                  <span className="text-[#13315c]"><span className="font-bold">No forms</span> - Zero paperwork</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-1.5 h-1.5 bg-[#134074] rounded-full"></div>
                  <span className="text-[#13315c]"><span className="font-bold">No wait</span> - Paid in under 6 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payout Breakdown */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-bold text-[#0b2545] mb-3">Coverage Breakdown</h2>
        <div className="bg-[#eef4ed] rounded-2xl border border-[#8da9c4]/40 p-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#8da9c4]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#8da9c4]/30 rounded-lg flex items-center justify-center">
                  <CloudRain className="w-4 h-4 text-[#134074]" strokeWidth={2.5} />
                </div>
                <span className="text-sm font-semibold text-[#0b2545]">Rainfall Events</span>
              </div>
              <span className="text-sm font-bold text-[#134074]">₹2,200</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-[#8da9c4]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#8da9c4]/30 rounded-lg flex items-center justify-center">
                  <Wind className="w-4 h-4 text-[#134074]" strokeWidth={2.5} />
                </div>
                <span className="text-sm font-semibold text-[#0b2545]">Pollution Events</span>
              </div>
              <span className="text-sm font-bold text-[#134074]">₹1,450</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-[#8da9c4]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#8da9c4]/30 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[#134074]" strokeWidth={2.5} />
                </div>
                <span className="text-sm font-semibold text-[#0b2545]">Storm Events</span>
              </div>
              <span className="text-sm font-bold text-[#134074]">₹950</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#8da9c4]/30 rounded-lg flex items-center justify-center">
                  <ThermometerSun className="w-4 h-4 text-[#134074]" strokeWidth={2.5} />
                </div>
                <span className="text-sm font-semibold text-[#0b2545]">Heat Events</span>
              </div>
              <span className="text-sm font-bold text-[#134074]">₹350</span>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
