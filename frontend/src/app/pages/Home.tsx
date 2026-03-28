import { MobileLayout } from '../components/MobileLayout';
import { Shield, CloudRain, Wind, AlertTriangle, CheckCircle, TrendingUp, Sparkles, Zap, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import {useState,useEffect} from 'react';
export function Home() {
  // const mockData = {
  //   policyActive: true,
  //   weeklyPremium: 36,
  //   currentRisk: 'medium',
  //   location: 'Bengaluru, PIN 560034',
  //   todayWeather: {
  //     temp: 33,
  //     rainfall: 15,
  //     aqi: 185,
  //   },
  //   nextPayout: null,
  //   thisWeekEarnings: 4800,
  //   protectedDays: 2,
  // };
  const [policy, setPolicy] = useState<any>(null);
  const user=JSON.parse(localStorage.getItem("gigshield_user") || "null");
  if (!user) {
  return <p>Please login</p>;
}
  useEffect(() => {
if(!user._id)return;
  fetch(`http://localhost:5000/api/dashboard/${user._id}`)
    .then(res => res.json())
    .then(data => {  console.log("API DATA:", data);setPolicy(data);})
    .catch(err=>console.log("error",err));
}, [user]);
if (!policy) {
  return (
    <MobileLayout>
      <p className="text-center mt-10">Loading...</p>
    </MobileLayout>
  );
}
const weather = policy?.todayWeather || {};
  return (
    <MobileLayout>
      {/* Hero Header - Oxford Navy to Prussian Blue */}
      <div className="relative bg-gradient-to-br from-[#134074] via-[#13315c] to-[#0b2545] text-white px-6 pt-12 pb-24 overflow-hidden">
        {/* Sophisticated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8da9c4] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0b2545] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">GigShield</h1>
          </div>
          <p className="text-[#8da9c4] text-sm flex items-center gap-2 ml-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
            {user.location}
          </p>
        </div>
      </div>

      {/* Policy Status Card - Mint Cream with Oxford Navy accents */}
      <div className="px-6 -mt-16 mb-6 relative z-20">
        <div className="bg-[#eef4ed] rounded-2xl shadow-2xl p-6 border border-[#8da9c4]/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[#134074] text-xs uppercase tracking-wide mb-1.5 font-semibold">Policy Status</p>
              <div className="flex items-center gap-2.5">
                <p className="text-3xl font-bold text-[#0b2545]">Active</p>
                <div className="px-3 py-1 bg-emerald-500 rounded-lg">
                  <p className="text-xs font-bold text-white">Live</p>
                </div>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-[#134074] to-[#13315c] rounded-2xl flex items-center justify-center shadow-lg shadow-[#134074]/30">
              <CheckCircle className="w-9 h-9 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div className="pt-4 border-t border-[#8da9c4]/40 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#13315c]/70 mb-1 font-medium">Weekly Premium</p>
              <p className="text-2xl font-bold text-[#134074]">₹{policy.weeklyPremium||0}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#13315c]/70 mb-1 font-medium">Next Payment</p>
              <p className="text-sm font-semibold text-[#0b2545]">Sun, Mar 23</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Risk Monitor */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#0b2545]">Today's Risk Monitor</h2>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eef4ed] rounded-lg border border-[#8da9c4]/40">
            <div className="w-1.5 h-1.5 bg-[#134074] rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-[#134074]">Live</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#eef4ed] rounded-2xl p-4 border border-[#8da9c4]/40 shadow-sm">
            <div className="w-11 h-11 bg-[#8da9c4]/40 rounded-xl flex items-center justify-center mb-3">
              <CloudRain className="w-6 h-6 text-[#134074]" strokeWidth={2.5} />
            </div>
            <p className="text-xs text-[#13315c]/70 mb-1.5 font-medium">Rainfall</p>
            <p className="text-2xl font-bold text-[#0b2545]">{weather.rainfall || 0}<span className="text-sm text-[#13315c]/60 font-normal ml-0.5">mm</span></p>
            <div className="mt-2.5 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
              <p className="text-xs font-semibold text-amber-600">Moderate</p>
            </div>
          </div>
          <div className="bg-[#eef4ed] rounded-2xl p-4 border border-[#8da9c4]/40 shadow-sm">
            <div className="w-11 h-11 bg-[#8da9c4]/40 rounded-xl flex items-center justify-center mb-3">
              <Wind className="w-6 h-6 text-[#134074]" strokeWidth={2.5} />
            </div>
            <p className="text-xs text-[#13315c]/70 mb-1.5 font-medium">AQI</p>
            <p className="text-2xl font-bold text-[#0b2545]">{weather.aqi||0}</p>
            <div className="mt-2.5 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
              <p className="text-xs font-semibold text-orange-600">Moderate</p>
            </div>
          </div>
          <div className="bg-[#eef4ed] rounded-2xl p-4 border border-[#8da9c4]/40 shadow-sm">
            <div className="w-11 h-11 bg-[#8da9c4]/40 rounded-xl flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-[#134074]" strokeWidth={2.5} />
            </div>
            <p className="text-xs text-[#13315c]/70 mb-1.5 font-medium">Temp</p>
            <p className="text-2xl font-bold text-[#0b2545]">{weather.temp||0}<span className="text-sm text-[#13315c]/60 font-normal ml-0.5">°C</span></p>
            <div className="mt-2.5 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              <p className="text-xs font-semibold text-emerald-600">Normal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banner - Cool Blue Gradient */}
      <div className="px-6 mb-6">
        <div className="relative bg-gradient-to-r from-[#134074] to-[#13315c] rounded-2xl p-5 text-white shadow-lg overflow-hidden border border-[#8da9c4]/30">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
          <div className="relative z-10 flex items-start gap-3.5">
            <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 border border-white/30">
              <AlertTriangle className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <p className="font-bold text-base">Heavy Rain Alert</p>
              </div>
              <p className="text-sm text-white/95 leading-relaxed">Expected Thursday. Work extra today — your Thursday income is fully protected under your ₹36 premium.</p>
            </div>
          </div>
        </div>
      </div>

      {/* This Week Earnings - Mint Cream Card */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-bold text-[#0b2545] mb-4">This Week's Summary</h2>
        <div className="bg-[#eef4ed] rounded-2xl border border-[#8da9c4]/40 p-6 shadow-sm">
          <div className="grid grid-cols-2 gap-6 mb-5">
            <div>
              <p className="text-xs text-[#13315c]/70 uppercase tracking-wide mb-2 font-semibold">Total Earnings</p>
              <p className="text-3xl font-bold text-[#0b2545]">₹{(policy.thisWeekEarnings ||0).toLocaleString()}</p>
              <div className="mt-2.5 flex items-center gap-1.5 text-emerald-600">
                <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
                <span className="text-xs font-semibold">+12% vs last week</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-[#13315c]/70 uppercase tracking-wide mb-2 font-semibold">Protected Days</p>
              <p className="text-3xl font-bold text-[#134074]">{policy.protectedDays||0}</p>
              <div className="mt-2.5 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span className="text-xs font-semibold text-emerald-600">Coverage Active</span>
              </div>
            </div>
          </div>
          <div className="pt-5 border-t border-[#8da9c4]/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#13315c]/70 mb-1.5 font-medium">Daily Coverage Amount</p>
                <p className="text-2xl font-bold text-[#134074]">₹400</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#134074] to-[#13315c] rounded-xl flex items-center justify-center shadow-md">
                <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zero-Touch Claims Info - Powder Blue background */}
      <div className="px-6 mb-6">
        <div className="bg-[#8da9c4]/20 rounded-2xl p-5 border border-[#8da9c4]/50">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 bg-[#134074] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-[#0b2545] mb-2 text-base">Zero-Touch Claims</p>
              <p className="text-sm text-[#13315c] leading-relaxed">
                When rain exceeds <span className="font-bold text-[#134074]">40mm/24hrs</span> or AQI crosses <span className="font-bold text-[#134074]">300</span>, you get auto-paid in under <span className="font-bold text-[#134074]">5 minutes</span>. No forms needed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* View All Plans CTA */}
      <div className="px-6 mb-6">
        <Link to="/premium">
          <button className="w-full bg-gradient-to-r from-[#134074] to-[#0b2545] text-white py-4 rounded-xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-2.5 group">
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" strokeWidth={2.5} />
            View All Coverage Plans
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">New</span>
          </button>
        </Link>
        <p className="text-center text-xs text-[#13315c]/60 mt-3">
          Compare Basic, Standard, and Premium plans • Upgrade anytime
        </p>
      </div>
    </MobileLayout>
  );
}