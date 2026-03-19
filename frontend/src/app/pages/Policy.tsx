import { MobileLayout } from '../components/MobileLayout';
import { Shield, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Policy() {
  const policyData = {
    uin: 'GIGS-2026-560034-8472',
    startDate: 'Feb 15, 2026',
    status: 'Active',
    currentPremium: 36,
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
      {/* HEADER */}
      <div className="relative bg-gradient-to-br from-[#134074] via-[#13315c] to-[#0b2545] text-white px-6 pt-12 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8da9c4] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0b2545] rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-1">My Policy</h1>
          <p className="text-[#8da9c4] text-sm">Income Protection Coverage</p>
        </div>
      </div>

      {/* POLICY CARD */}
      <div className="px-6 -mt-16 mb-6 relative z-20">
        <div className="bg-[#eef4ed] rounded-2xl shadow-2xl p-6 border border-[#8da9c4]/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#134074] to-[#13315c] rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-xs text-[#13315c]/70">Policy UIN</p>
              <p className="font-mono font-semibold text-[#0b2545]">
                {policyData.uin}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#8da9c4]/40 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#13315c]/70 mb-1">Start Date</p>
              <p className="font-semibold text-[#0b2545]">
                {policyData.startDate}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#13315c]/70 mb-1">Status</p>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <p className="font-semibold text-emerald-600">
                  {policyData.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PREMIUM SECTION */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-bold text-[#0b2545] mb-3">
          Weekly Premium Breakdown
        </h2>

        <div className="bg-[#eef4ed] rounded-2xl border border-[#8da9c4]/40 p-5 shadow-sm">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <p className="text-sm text-[#13315c]/70">
                Current Week Premium
              </p>
              <p className="text-3xl font-bold text-[#0b2545]">
                ₹{policyData.currentPremium}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#13315c]/70">Risk Score</p>
              <p className="text-lg font-semibold text-[#134074]">
                {policyData.riskMultiplier}x
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {policyData.premiumBreakdown.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-[#8da9c4]/30 last:border-0"
              >
                <p className="text-sm text-[#13315c]">{item.factor}</p>
                <p
                  className={`text-sm font-semibold ${
                    item.impact
                      ? item.impact.startsWith('+')
                        ? 'text-red-500'
                        : 'text-emerald-600'
                      : 'text-[#0b2545]'
                  }`}
                >
                  {item.value || item.impact}
                </p>
              </div>
            ))}

            <div className="flex items-center justify-between py-2 pt-3 border-t-2 border-[#8da9c4]/50">
              <p className="font-semibold text-[#0b2545]">Total Premium</p>
              <p className="text-lg font-bold text-[#134074]">₹36</p>
            </div>
          </div>

          <div className="mt-4 bg-[#8da9c4]/20 rounded-lg p-3 border border-[#8da9c4]/40">
            <p className="text-xs text-[#13315c]">
              Premium recalculated every Sunday using AI model. Week-over-week
              changes capped at ±10%.
            </p>
          </div>
        </div>
      </div>

      {/* COVERAGE */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-bold text-[#0b2545] mb-3">
          Coverage Details
        </h2>

        <div className="bg-[#eef4ed] rounded-2xl border border-[#8da9c4]/40 p-5 space-y-3">
          {Object.entries(policyData.coverage).map(([key, value], index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                <p className="font-semibold text-[#0b2545] capitalize">
                  {key}
                </p>
                <p className="text-sm text-[#13315c]">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IRDAI */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-bold text-[#0b2545] mb-3">
          IRDAI Compliance
        </h2>

        <div className="bg-[#eef4ed] rounded-2xl border border-[#8da9c4]/40 p-4 space-y-3">
          {[
            'Digital Policy with UIN issued',
            '30-day free look period active',
            'Nominee registered (mandatory)',
            'Full premium breakdown shown',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <p className="text-sm text-[#13315c]">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* DOWNLOAD */}
      <div className="px-6 mb-6">
        <button className="w-full bg-gradient-to-r from-[#134074] to-[#13315c] text-white py-3 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2">
          <FileText className="w-5 h-5" />
          Download Policy Document
        </button>
      </div>

      {/* CTA */}
      <div className="px-6 mb-6">
        <Link to="/premium">
          <button className="w-full bg-gradient-to-r from-[#134074] to-[#0b2545] text-white py-3 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2">
            <Shield className="w-5 h-5" />
            View Other Plans & Upgrade
          </button>
        </Link>
      </div>

      {/* WARNING */}
      <div className="px-6 mb-6">
        <div className="bg-[#8da9c4]/20 rounded-xl p-4 border border-[#8da9c4]/50 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#134074] mt-0.5" />
          <p className="text-sm text-[#13315c]">
            <span className="font-semibold">Free Look Period:</span> Cancel
            anytime within 30 days for a full refund.
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}