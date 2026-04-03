import { MobileLayout } from '../components/MobileLayout';
import { CloudRain, Wind, Thermometer, AlertCircle, CheckCircle } from 'lucide-react';
import {useState,useEffect} from 'react';
export function Forecast() {
 const [forecast, setForecast] = useState<any[]>([]);
const user = JSON.parse(localStorage.getItem("gigshield_user") || "null");
useEffect(() => {
  fetch(`http://localhost:5000/api/forecast/${user._id}`)
    .then(res => res.json())
    .then(data => setForecast(data))
    .catch(err => console.log(err));
}, []);



  return (
    <MobileLayout>
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0b2545] text-white px-6 pt-12 pb-8">
        <h1 className="text-2xl font-bold mb-2">7-Day Risk Forecast</h1>
        <p className="text-[#eef4ed]/80 text-sm">Bengaluru, PIN 560034</p>
      </div>

      <div className="px-6 -mt-4 mb-6">
        <div className="bg-[#dfe6ea] border border-[#c7d3db] rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-5 h-5" />
            <p className="font-semibold text-[#13315c]/70">High Risk Alert - Thursday</p>
          </div>
          <p className="text-sm text-[#13315c]/70">Expected rainfall: 48mm. Auto-payout likely.</p>
        </div>
      </div>

      <div className="px-6 mb-6">
        <div className="space-y-3">
          {forecast.map((day, index) => (
            <div
              key={index}
              className={`rounded-xl p-4 border-2 ${
                day.risk === 'high'
                  ? 'bg-[#fdf2f2] border-[#d9534f]/40'
                  : day.risk === 'medium'
                  ? 'bg-[#fff7ed] border-[#f0ad4e]/40'
                  : 'bg-[#eef9f1] border-[#5cb85c]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-[#0b2545]">{day.day}</p>
                  <p className="text-xs text-[#13315c]/70">{day.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  {day.risk === 'high' ? (
                    <div className="px-3 py-1 bg-[#d9534f] text-white rounded-full text-xs font-semibold">
                      High Risk
                    </div>
                  ) : day.risk === 'medium' ? (
                    <div className="px-3 py-1 bg-[#f0ad4e] text-white rounded-full text-xs font-semibold">
                      Medium
                    </div>
                  ) : (
                    <div className="px-3 py-1 bg-[#5cb85c] text-white rounded-full text-xs font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Safe
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <CloudRain className="w-5 h-5 text-[#134074]" />
                  <div>
                    <p className="text-xs text-gray-600">Rain</p>
                    <p className="font-semibold text-gray-900">{day.rainfall}mm</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-xs text-gray-600">Temp</p>
                    <p className="font-semibold text-gray-900">{day.temp}°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-600">AQI</p>
                    <p className="font-semibold text-gray-900">{day.aqi}</p>
                  </div>
                </div>
              </div>

              {day.risk === 'high' && (
                <div className="mt-3 pt-3 border-t border-red-200">
                  <p className="text-sm text-[#134074]">
                    ⚡ Rainfall exceeds 40mm threshold - Auto-payout of <span className="font-bold">₹400</span> likely
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 mb-6">
        <div className="bg-[#dfe6ea] rounded-xl p-4 border border-blue-200">
          <h3 className="font-semibold text-[#0b2545] mb-2">Parametric Triggers</h3>
          <ul className="text-sm text-[#13315c]/70 space-y-1">
            <li>• Rain {'>'} 40mm/24hrs → ₹400 payout</li>
            <li>• AQI {'>'} 300 → ₹400 payout</li>
            <li>• Heat ≥ 40°C → ₹400 payout</li>
          </ul>
        </div>
      </div>
    </MobileLayout>
  );
}
