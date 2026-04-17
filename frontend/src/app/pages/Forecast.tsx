import { MobileLayout } from '../components/MobileLayout';
import { CloudRain, Wind, Thermometer, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { API_BASE } from '../../config';
 
export function Forecast() {
  const [forecast, setForecast] = useState<any[]>([]);
  const user = JSON.parse(localStorage.getItem("gigshield_user") || "null");

  useEffect(() => {
    // 1. Safety check
    if (!user?._id && !user?.id) return;

    const userId = user._id || user.id;
    // 2. Grab the token from the browser's pocket
    const token = localStorage.getItem("token");

    // 3. Fetch with headers and the HTML crash preventer
    fetch(`${API_BASE}/api/forecast/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Forecast route not found (404)");
        return res.json();
      })
      .then(data => setForecast(data))
      .catch(err => console.error("Fetch forecast error:", err));
      
  }, [user]); 

  return (
    <MobileLayout>
      {/* Header - matches Signup gradient */}
      <div className="relative bg-gradient-to-br from-[#134074] via-[#13315c] to-[#0b2545] text-white px-6 pt-12 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8da9c4] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0b2545] rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">7-Day Risk Forecast</h1>
          <p className="text-[#8da9c4] text-sm">Bengaluru, PIN 560034</p>
        </div>
      </div>

      {/* Content - consistent card styling */}
      <div className="px-6 -mt-10 pb-8 relative z-20">
        {/* High Risk Alert Card */}
        <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-5 h-5 text-rose-600" strokeWidth={2.5} />
            <p className="font-bold text-rose-800">High Risk Alert - Thursday</p>
          </div>
          <p className="text-sm text-rose-700">Expected rainfall: 48mm. Auto-payout likely.</p>
        </div>

        {/* Forecast Cards */}
        <div className="space-y-3">
          {forecast.map((day, index) => (
            <div
              key={index}
              className={`rounded-xl p-4 border-2 transition-all ${
                day.risk === 'high'
                  ? 'bg-rose-50 border-rose-200'
                  : day.risk === 'medium'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-emerald-50 border-emerald-200'
              }`}
            >
              {/* Header with day and risk badge */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-[#0b2545] text-lg">{day.day}</p>
                  <p className="text-xs text-[#13315c]/70">{day.date}</p>
                </div>
                <div>
                  {day.risk === 'high' ? (
                    <span className="px-3 py-1 bg-rose-600 text-white rounded-full text-xs font-semibold">
                      High Risk
                    </span>
                  ) : day.risk === 'medium' ? (
                    <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-semibold">
                      Medium Risk
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Safe
                    </span>
                  )}
                </div>
              </div>

              {/* Weather metrics */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/60 rounded-lg flex items-center justify-center">
                    <CloudRain className="w-5 h-5 text-[#134074]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#13315c]/70">Rain</p>
                    <p className="font-bold text-[#0b2545]">{day.rainfall}mm</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/60 rounded-lg flex items-center justify-center">
                    <Thermometer className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-[#13315c]/70">Temp</p>
                    <p className="font-bold text-[#0b2545]">{day.temp}°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/60 rounded-lg flex items-center justify-center">
                    <Wind className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-[#13315c]/70">AQI</p>
                    <p className="font-bold text-[#0b2545]">{day.aqi}</p>
                  </div>
                </div>
              </div>

              {/* Payout alert for high risk */}
              {day.risk === 'high' && (
                <div className="mt-3 pt-3 border-t border-rose-200">
                  <p className="text-sm text-rose-700">
                    ⚡ Rainfall exceeds 40mm threshold - Auto-payout of <span className="font-bold">₹400</span> likely
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Parametric Triggers Card */}
        <div className="mt-6 bg-[#eef4ed] rounded-xl p-5 border border-[#8da9c4]/40 shadow-sm">
          <h3 className="font-bold text-[#0b2545] mb-3 text-lg">Parametric Triggers</h3>
          <ul className="space-y-2 text-sm text-[#13315c]">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
              Rain &gt; 40mm/24hrs → <span className="font-bold text-[#134074]">₹400 payout</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              AQI &gt; 300 → <span className="font-bold text-[#134074]">₹400 payout</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Heat ≥ 40°C → <span className="font-bold text-[#134074]">₹400 payout</span>
            </li>
          </ul>
        </div>
      </div>
    </MobileLayout>
  );
}