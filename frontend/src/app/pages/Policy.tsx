import { MobileLayout } from '../components/MobileLayout';
import { Shield, Calendar, IndianRupee, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Policy() {
  const policyData = {
    uin: 'GIGS-2026-560034-8472',
    startDate: 'Feb 15, 2026',
    status: 'Active',
    currentPremium: 36,
    baseRate: 30,
    riskMultiplier: 1.2,
    coverage: {
      rain: '₹400 when >40mm/24hrs',
      pollution: '₹400 when AQI >300',
      heat: '₹400 when ≥40°C',
      outage: '₹400 when >2hrs downtime',
    },
    premiumBreakdown: [
      { factor: 'Base Premium', value: '₹30' },
      { factor: '7-day Rainfall Forecast', impact: '+₹3' },
      { factor: 'Max Temperature Risk', impact: '+₹1' },
      { factor: 'AQI Forecast', impact: '+₹2' },
      { factor: 'Zone History', impact: '+₹0' },
    ],
  };

  return (
    <MobileLayout>
      <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white px-6 pt-12 pb-8">
        <h1 className="text-2xl font-bold mb-2">My Policy</h1>
        <p className="text-purple-100 text-sm">Income Protection Coverage</p>
      </div>

      <div className="px-6 -mt-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Policy UIN</p>
              <p className="font-mono font-semibold text-gray-900">{policyData.uin}</p>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Start Date</p>
              <p className="font-semibold text-gray-900">{policyData.startDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="font-semibold text-green-600">{policyData.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Weekly Premium Breakdown</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Current Week Premium</p>
              <p className="text-3xl font-bold text-gray-900">₹{policyData.currentPremium}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Risk Score</p>
              <p className="text-lg font-semibold text-amber-600">{policyData.riskMultiplier}x</p>
            </div>
          </div>

          <div className="space-y-2">
            {policyData.premiumBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <p className="text-sm text-gray-700">{item.factor}</p>
                <p className={`text-sm font-semibold ${
                  item.impact 
                    ? item.impact.startsWith('+') 
                      ? 'text-red-600' 
                      : 'text-green-600'
                    : 'text-gray-900'
                }`}>
                  {item.value || item.impact}
                </p>
              </div>
            ))}
            <div className="flex items-center justify-between py-2 pt-3 border-t-2 border-gray-300">
              <p className="font-semibold text-gray-900">Total Premium</p>
              <p className="text-lg font-bold text-purple-600">₹36</p>
            </div>
          </div>

          <div className="mt-4 bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              Premium recalculated every Sunday using AI model. Week-over-week changes capped at ±10%.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Coverage Details</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          {Object.entries(policyData.coverage).map(([key, value], index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 capitalize">{key}</p>
                <p className="text-sm text-gray-600">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">IRDAI Compliance</h2>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-900">Digital Policy with UIN issued</p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-900">30-day free look period active</p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-900">Nominee registered (mandatory)</p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-900">Full premium breakdown shown</p>
          </div>
        </div>
      </div>

      <div className="px-6 mb-6">
        <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
          <FileText className="w-5 h-5" />
          Download Policy Document
        </button>
      </div>

      <div className="px-6 mb-6">
        <Link to="/premium">
          <button className="w-full bg-gradient-to-r from-[#134074] to-[#0b2545] text-white py-3 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2">
            <Shield className="w-5 h-5" />
            View Other Plans & Upgrade
          </button>
        </Link>
      </div>

      <div className="px-6 mb-6">
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-900">
              <span className="font-semibold">Free Look Period:</span> Cancel anytime within 30 days for a full refund. No questions asked.
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}