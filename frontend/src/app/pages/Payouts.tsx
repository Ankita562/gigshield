import { MobileLayout } from '../components/MobileLayout';
import {
  CheckCircle,
  CloudRain,
  Wind,
  Zap,
  ThermometerSun,
  CloudDrizzle,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { API_BASE } from '../../config';

type Claim = {
  _id: string;
  amountInr: number;
  claimType: string;
  status: string;
  timestamp: string;
};

export function Payouts() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [payouts, setPayouts] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("gigshield_user") || "null");

  useEffect(() => {
    if (!user?._id && !user?.id) {
      setLoading(false);
      return;
    }

    const userId = user._id || user.id;

  const fetchData = () => {
    // 1. Grab the token from Local Storage
    const token = localStorage.getItem('token');

    // 2. Add the token to the Headers of the fetch request
    fetch(`${API_BASE}/api/claims/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // <--- The magic key!
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPayouts(data);
        } else if (Array.isArray(data?.claims)) {
          setPayouts(data.claims);
        } else {
          setPayouts([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setPayouts([]);
      })
      .finally(() => setLoading(false));
  };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [user?._id, user?.id]);

  // Transform payouts with calculated fields (same as first version)
  const payoutsWithCalculations = payouts.map((p) => ({
    id: p._id,
    date: p.timestamp ? new Date(p.timestamp).toDateString() : "No date",
    time: p.timestamp ? new Date(p.timestamp).toLocaleTimeString() : "-",
    trigger: p.claimType || "Unknown",
    triggerType:
      p.claimType === "Heavy Rain"
        ? "rain"
        : p.claimType === "Heatwave"
        ? "heat"
        : "pollution",
    value:
      p.claimType === "Heavy Rain"
        ? "40mm+"
        : p.claimType === "Heatwave"
        ? "40°C+"
        : "AQI 300+",
    severity: "High",
    status: p.status === "approved" ? "paid" : "rejected",
    upiRef: "AUTO",
    processingTime: "5 mins",
    baseamountInr: p.amountInr || 0,
    severityMultiplier: 1,
    rarityFactor: 1,
    riskFactor: 1,
    cap: { min: p.amountInr || 0, max: p.amountInr || 0 },
    amountInr: p.amountInr || 0,
  }));

  // Filter based on active filter
  const filteredPayouts = payoutsWithCalculations.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'paid') return p.status === "paid" && p.amountInr > 0;
    if (activeFilter === 'pending') return p.status === "pending";
    return false;
  });

  const totalPaid = payoutsWithCalculations
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amountInr, 0);

  const thisMonth = new Date().toLocaleString("en-US", { month: "short" });
  const thisMonthPayouts = payoutsWithCalculations.filter(
    (p) => p.date.includes(thisMonth) && p.status === 'paid'
  );
  const thisMonthTotal = thisMonthPayouts.reduce((sum, p) => sum + p.amountInr, 0);

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
      {/* Hero Header - matches Signup/Forecast gradient */}
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

      {/* Summary Cards */}
      <div className="px-6 -mt-16 mb-6 relative z-20">
        <div className="bg-[#eef4ed] rounded-2xl shadow-2xl p-6 border border-[#8da9c4]/30 mb-4">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs text-[#13315c]/70 mb-1.5 font-medium uppercase tracking-wide">All-Time Total</p>
              <p className="text-4xl font-bold text-[#0b2545]">₹{totalPaid.toLocaleString()}</p>
              <div className="mt-2 flex items-center gap-1.5 text-emerald-600">
                <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
                <span className="text-xs font-semibold">{payouts.length} payouts</span>
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
          {(["all", "paid", "pending"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-[#134074] text-white shadow-md'
                  : 'bg-[#eef4ed] text-[#13315c] border border-[#8da9c4]/40'
              }`}
            >
              {filter[0].toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 mb-4">
        <h2 className="text-lg font-bold text-[#0b2545]">Recent Payouts</h2>
      </div>

      {/* Payout Cards */}
      <div className="px-6 mb-6 space-y-3 pb-28">
        {loading ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-slate-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#134074] mx-auto mb-3"></div>
            <p className="text-[#13315c] font-medium">Loading payouts...</p>
          </div>
        ) : filteredPayouts.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-slate-100">
            <p className="text-[#13315c] font-medium">No payouts found</p>
            <p className="text-xs text-[#13315c]/60 mt-1">Payouts will appear when weather conditions trigger them</p>
          </div>
        ) : (
          filteredPayouts.map((payout) => (
            <div key={payout.id} className="bg-[#eef4ed] rounded-2xl border border-[#8da9c4]/40 overflow-hidden shadow-sm">
              <div className="p-5 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-11 h-11 bg-[#8da9c4]/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      {getEventIcon(payout.triggerType)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[#0b2545] text-base">{payout.trigger}</p>
                      <p className="text-xs text-[#13315c]/60">{payout.date} • {payout.time}</p>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <p className={`text-2xl font-bold ${payout.status === 'paid' ? "text-emerald-600" : "text-red-500"}`}>
                      {payout.status === "paid" ? `+₹${payout.amountInr}` : "₹0"}
                    </p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      {payout.status === 'paid' ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-xs font-semibold text-emerald-600">Paid</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                          <span className="text-xs font-semibold text-red-600">Rejected</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${getSeverityColor(payout.severity)}`}>
                    {payout.severity} Severity
                  </div>
                  <div className="flex-1 h-2 bg-[#8da9c4]/20 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${getIntensityBar(payout.severity)}`}></div>
                  </div>
                </div>

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

                <div className="bg-gradient-to-r from-[#134074]/5 to-[#13315c]/5 rounded-xl p-3 border border-[#134074]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[#134074]" strokeWidth={2.5} />
                    <span className="text-xs font-bold text-[#134074]">AI Calculated Payout</span>
                    <Info className="w-3.5 h-3.5 text-[#13315c]/60" strokeWidth={2} />
                  </div>
                  <div className="text-xs text-[#13315c]/80 font-mono leading-relaxed">
                    <span className="text-[#0b2545] font-semibold">Base ₹{payout.baseamountInr}</span>
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

              <div className="bg-[#8da9c4]/10 px-5 py-3 border-t border-[#8da9c4]/30">
                <div className="grid grid-cols-2 gap-3">
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
          ))
        )}
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
                GigKavach monitors weather & AQI 24/7. When thresholds are breached in your area, you get auto-paid to your UPI instantly.
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

      {/* Coverage Breakdown */}
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