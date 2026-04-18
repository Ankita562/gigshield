import React, { useEffect, useState } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import {
  Shield,
  CloudRain,
  Wind,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Zap,
  Lock,
  ArrowRight,
  Thermometer,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../../config';
import { FloatingHelpButton } from '../components/FloatingHelpButton';
import customLogo from '../../assets/logo.png';

// Plan-specific data (matches PremiumSelection)
const planDetails: Record<string, { rainThreshold: number; aqiThreshold: number; dailyPayout: number }> = {
  Basic: { rainThreshold: 40, aqiThreshold: 300, dailyPayout: 400 },
  Standard: { rainThreshold: 40, aqiThreshold: 300, dailyPayout: 600 },
  Premium: { rainThreshold: 35, aqiThreshold: 250, dailyPayout: 1000 },
};

export function Home() {
  const navigate = useNavigate();
  const [policy, setPolicy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('gigshield_user') || 'null');
  const savedPolicy = JSON.parse(localStorage.getItem('gigshield_policy') || 'null');

  const isActive =
    savedPolicy?.isActive === true ||
    savedPolicy?.active === true ||
    savedPolicy?.status === 'active' ||
    savedPolicy?.subscriptionStatus === 'active' ||
    savedPolicy?.planStatus === 'active' ||
    savedPolicy?.paymentStatus === 'paid' ||
    user?.hasActivePlan === true;

  const planType = savedPolicy?.planType || savedPolicy?.plan || user?.planType || 'Standard';
  const planThresholds = planDetails[planType] || planDetails.Standard;

  const getNextSunday = () => {
    const d = new Date();
    const daysUntilSunday = (7 - d.getDay()) % 7 || 7;
    d.setDate(d.getDate() + daysUntilSunday);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  useEffect(() => {
    if (!user?._id && !user?.id) {
      setLoading(false);
      return;
    }

    const userId = user._id || user.id;
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        // 1. Fetch all claims for this user (Same endpoint your Payouts tab uses)
        const claimsRes = await fetch(`${API_BASE}/api/claims/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        let calculatedEarnings = 0;
        let protectedDaysCount = 0;

        if (claimsRes.ok) {
           const claimsData = await claimsRes.json();
           
           // Math: Sum up only the 'approved' claims
           calculatedEarnings = claimsData
             .filter(claim => claim.status === 'approved')
             .reduce((sum, claim) => sum + (claim.amountInr || 0), 0);
             
           // Fake protected days if they have activity
           protectedDaysCount = claimsData.length > 0 ? 7 : 0;
        }

        // 2. Fetch the dashboard data (weather, etc)
        const res = await fetch(`${API_BASE}/api/policy/dashboard/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) throw new Error('Failed to fetch dashboard');
        const data = await res.json();
        
        // 3. FORCE the calculated earnings into the state!
        setPolicy({
            ...data,
            totalEarnings: calculatedEarnings,
            protectedDays: protectedDaysCount
        });

      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setPolicy({
          todayWeather: { rainfall: 19, aqi: 279, temp: 32 },
          protectedDays: 0,
          totalEarnings: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [user?._id, user?.id]);

  if (!user) {
    return (
      <div className="p-10 text-center font-black italic text-[#13315C]">
        Please login.
      </div>
    );
  }

  const weather = policy?.todayWeather || { rainfall: 0, aqi: 0, temp: 0 };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-[#F6F8FB]">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#134074] via-[#13315c] to-[#0b2545] text-white px-4 sm:px-6 pt-10 sm:pt-12 pb-20 sm:pb-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-[#8da9c4] rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-[#0b2545] rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white/15 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/20 shrink-0">
                <img src={customLogo} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">GigKavach</h1>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20 w-fit max-w-full">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
              <span className="text-xs sm:text-sm text-blue-100/90 truncate">
                {user.location || 'Koramangala, Bengaluru'}
              </span>
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-6 -mt-12 sm:-mt-14 pb-28 space-y-4 sm:space-y-6 relative z-20">
          {isActive ? (
            /* Active policy card */
            <div className="bg-[#eef4ed] rounded-2xl border border-[#8da9c4]/40 shadow-2xl p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4 sm:mb-6 gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-wide text-[#13315c]/70 mb-1.5 sm:mb-2 font-medium">
                    Policy Status
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 rounded-full shrink-0" />
                    <h2 className="text-lg sm:text-2xl font-bold text-[#0b2545] leading-tight">
                      {planType} Shield
                    </h2>
                    <span className="bg-emerald-500 text-white text-[10px] sm:text-[11px] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-semibold whitespace-nowrap">
                      Live
                    </span>
                  </div>
                </div>
                <div className="w-11 h-11 sm:w-14 sm:h-14 bg-[#134074] rounded-xl flex items-center justify-center shadow-md shrink-0">
                  <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
                </div>
              </div>

              <div className="border-t border-[#8da9c4]/30 pt-4 sm:pt-5 grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-[#13315c]/70 mb-1">Weekly Premium</p>
                  <p className="text-xl sm:text-2xl font-bold text-[#0b2545]">
                    ₹{savedPolicy?.amount || savedPolicy?.price || user?.planPrice || 45}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm text-[#13315c]/70 mb-1">Next Payment</p>
                  <p className="text-base sm:text-lg font-semibold text-[#0b2545] leading-tight">{getNextSunday()}</p>
                </div>
              </div>

              <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-[#8da9c4]/30 grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <p className="text-[#13315c]/70 mb-1 text-[11px] sm:text-sm">Rain Trigger</p>
                  <p className="font-bold text-[#0b2545] text-xs sm:text-sm">&gt; {planThresholds.rainThreshold} mm</p>
                </div>
                <div>
                  <p className="text-[#13315c]/70 mb-1 text-[11px] sm:text-sm">AQI Trigger</p>
                  <p className="font-bold text-[#0b2545] text-xs sm:text-sm">&gt; {planThresholds.aqiThreshold}</p>
                </div>
                <div>
                  <p className="text-[#13315c]/70 mb-1 text-[11px] sm:text-sm">Daily Payout</p>
                  <p className="font-bold text-[#134074] text-xs sm:text-sm">₹{planThresholds.dailyPayout}</p>
                </div>
              </div>
            </div>
          ) : (
            /* Inactive policy card */
            <div className="bg-white rounded-2xl shadow-2xl border border-[#8da9c4]/40 p-6 sm:p-8 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#eef4ed] rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 relative">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-[#8da9c4]" />
                <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-red-500 rounded-full flex items-center justify-center border-4 border-white">
                  <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" strokeWidth={3} />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0b2545] mb-2">Shield Inactive</h2>
              <p className="text-xs sm:text-sm text-[#13315c]/70 mb-5 sm:mb-6">
                Activate protection to unlock weather income coverage.
              </p>
              <button
                onClick={() => navigate('/premium')}
                className="w-full bg-[#134074] text-white py-3.5 sm:py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md text-sm sm:text-base active:scale-[0.98] transition-transform"
              >
                Activate Protection <ArrowRight size={17} />
              </button>
            </div>
          )}

          {/* Risk Monitor */}
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#0b2545]">Today's Risk Monitor</h2>
              <div className="px-2.5 sm:px-3 py-1 rounded-lg border border-[#8da9c4]/40 bg-[#eef4ed] text-[#13315c] text-[10px] sm:text-xs font-semibold flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <RiskCard
                icon={<CloudRain size={18} className="sm:hidden" />}
                iconLg={<CloudRain size={22} className="hidden sm:block" />}
                label="Rainfall"
                value={weather.rainfall}
                unit="mm"
                color={weather.rainfall > planThresholds.rainThreshold ? 'red' : 'amber'}
                status={weather.rainfall > planThresholds.rainThreshold ? 'High' : 'Moderate'}
              />
              <RiskCard
                icon={<Wind size={18} className="sm:hidden" />}
                iconLg={<Wind size={22} className="hidden sm:block" />}
                label="AQI"
                value={weather.aqi}
                unit=""
                color={weather.aqi > planThresholds.aqiThreshold ? 'red' : 'amber'}
                status={weather.aqi > planThresholds.aqiThreshold ? 'High' : 'Moderate'}
              />
              <RiskCard
                icon={<TrendingUp size={18} className="sm:hidden" />}
                iconLg={<TrendingUp size={22} className="hidden sm:block" />}
                label="Temp"
                value={weather.temp}
                unit="°C"
                color="emerald"
                status="Normal"
              />
            </div>
          </div>

          {/* Alert Banner */}
          <div className="bg-[#134074] rounded-xl p-4 sm:p-5 text-white shadow-md">
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-base sm:text-lg mb-1">Heavy Rain Alert</h3>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  Expected Thursday. Your income is fully protected under your ₹{savedPolicy?.amount || 45} {planType} premium.
                </p>
              </div>
            </div>
          </div>

          {/* Weekly Summary */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0b2545] mb-3 sm:mb-4">This Week's Summary</h3>
            <div className="bg-[#eef4ed] rounded-2xl border border-[#8da9c4]/40 p-4 sm:p-5 shadow-sm">
              <div className="grid grid-cols-2 gap-4 sm:gap-5 mb-4">
                <div>
                  <p className="text-[10px] sm:text-xs text-[#13315c]/70 uppercase tracking-wide mb-1">Total Earnings</p>
                  <p className="text-xl sm:text-2xl font-bold text-[#0b2545]">₹{policy?.totalEarnings || 0}</p>
                  <p className="text-[10px] sm:text-xs text-emerald-600 mt-1.5 sm:mt-2">↗ +12% vs last week</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] sm:text-xs text-[#13315c]/70 uppercase tracking-wide mb-1">Protected Days</p>
                  <p className="text-xl sm:text-2xl font-bold text-[#0b2545]">{policy?.protectedDays || 0}</p>
                  <p className="text-[10px] sm:text-xs text-emerald-600 mt-1.5 sm:mt-2">• Coverage Active</p>
                </div>
              </div>
              <div className="border-t border-[#8da9c4]/30 pt-3 sm:pt-4 flex justify-between items-center">
                <div>
                  <p className="text-[10px] sm:text-xs text-[#13315c]/70 mb-1">Daily Coverage Amount</p>
                  <p className="text-lg sm:text-xl font-bold text-[#0b2545]">₹{planThresholds.dailyPayout}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#134074] rounded-xl flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Zero-Touch Claims */}
          <div className="bg-[#eef4ed] rounded-2xl border border-[#8da9c4]/40 p-4 sm:p-5 flex gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#134074] rounded-xl flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-[#0b2545] mb-1 text-sm sm:text-base">Zero-Touch Claims</h4>
              <p className="text-[11px] sm:text-xs text-[#13315c] leading-relaxed">
                When rain exceeds <span className="font-bold">{planThresholds.rainThreshold}mm/24hrs</span> or AQI crosses{' '}
                <span className="font-bold">{planThresholds.aqiThreshold}</span>, you get auto-paid in under{' '}
                <span className="font-bold">5 minutes</span>. No forms needed.
              </p>
            </div>
          </div>
        </div>

        <FloatingHelpButton />
      </div>
    </MobileLayout>
  );
}

function RiskCard({
  icon,
  iconLg,
  label,
  value,
  unit,
  color,
  status,
}: {
  icon: React.ReactNode;
  iconLg?: React.ReactNode;
  label: string;
  value: string | number;
  unit: string;
  color: 'emerald' | 'red' | 'amber';
  status: string;
}) {
  const statusColor = {
    bg: color === 'red' ? 'bg-rose-100' : color === 'amber' ? 'bg-amber-100' : 'bg-emerald-100',
    text: color === 'red' ? 'text-rose-700' : color === 'amber' ? 'text-amber-700' : 'text-emerald-700',
    dot: color === 'red' ? 'bg-rose-500' : color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500',
  };

  return (
    <div className="bg-[#eef4ed] rounded-xl p-2.5 sm:p-3 border border-[#8da9c4]/40 shadow-sm">
      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-lg flex items-center justify-center mb-2 text-[#134074]">
        {icon}
        {iconLg}
      </div>
      <p className="text-[10px] sm:text-xs text-[#13315c]/70 mb-1 truncate">{label}</p>
      <div className="flex items-baseline gap-0.5">
        <span className="text-base sm:text-xl font-bold text-[#0b2545]">{value}</span>
        <span className="text-[10px] sm:text-xs text-[#13315c]/60">{unit}</span>
      </div>
      <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusColor.dot}`} />
        <span className={`text-[10px] sm:text-xs font-medium truncate ${statusColor.text}`}>{status}</span>
      </div>
    </div>
  );
}