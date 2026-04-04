import React, { useEffect, useState } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { Shield, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../../config';

export function Policy() {
  const [policyData, setPolicyData] = useState<any | null>(null);

  const user = JSON.parse(localStorage.getItem('gigshield_user') || 'null');

  // Direct path to PDF in public folder – no import needed
  const policyPdf = '/gigangelpolicy.pdf';

  useEffect(() => {
    if (!user?._id) return;
    fetch(`${API_BASE}/api/dashboard/${user._id}`)
      .then((r) => r.json())
      .then((d) => setPolicyData(d))
      .catch((err) => {
        console.error('Failed to fetch policy data:', err);
        setPolicyData(null);
      });
  }, [user?._id]);

  if (!policyData) {
    return (
      <MobileLayout>
        <p className="text-center mt-10">Loading...</p>
      </MobileLayout>
    );
  }

  const safeData = {
    uin: policyData?.uin || 'IRDAI-12345',
    startDate: policyData?.startDate || 'Feb 2026',
    status: policyData?.status || 'Active',
    weeklyPremium: policyData?.weeklyPremium || 36,
    riskMultiplier: policyData?.riskMultiplier || 1,
    premiumBreakdown: policyData?.premiumBreakdown || [
      { factor: 'Base Premium', impact: '₹30' },
      { factor: 'Weather Risk', impact: '+₹6' },
    ],
  };

  const handleOpenPolicy = () => {
    window.open(policyPdf, '_blank', 'noopener,noreferrer');
  };

  return (
    <MobileLayout>
      {/* HEADER */}
      <div className="relative bg-gradient-to-br from-[#134074] via-[#13315c] to-[#0b2545] text-white px-6 pt-12 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8da9c4] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0b2545] rounded-full blur-3xl" />
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
              <p className="font-mono font-semibold text-[#0b2545]">{safeData.uin}</p>
            </div>
          </div>
          <div className="pt-4 border-t border-[#8da9c4]/40 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#13315c]/70 mb-1">Start Date</p>
              <p className="font-semibold text-[#0b2545]">{safeData.startDate}</p>
            </div>
            <div>
              <p className="text-xs text-[#13315c]/70 mb-1">Status</p>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <p className="font-semibold text-emerald-600">{safeData.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PREMIUM */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-bold text-[#0b2545] mb-3">Weekly Premium Breakdown</h2>
        <div className="bg-[#eef4ed] rounded-2xl border border-[#8da9c4]/40 p-5 shadow-sm">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <p className="text-sm text-[#13315c]/70">Current Week Premium</p>
              <p className="text-3xl font-bold text-[#0b2545]">₹{safeData.weeklyPremium}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#13315c]/70">Risk Score</p>
              <p className="text-lg font-semibold text-[#134074]">{safeData.riskMultiplier}x</p>
            </div>
          </div>
          <div className="space-y-2">
            {safeData.premiumBreakdown.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-[#8da9c4]/30 last:border-0">
                <p className="text-sm text-[#13315c]">{item.factor}</p>
                <p className="text-sm font-semibold text-[#0b2545]">{item.value || item.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* POLICY DOCUMENT BUTTON */}
      <div className="px-6 mb-4">
        <button
          onClick={handleOpenPolicy}
          className="w-full bg-gradient-to-r from-[#134074] to-[#13315c] text-white py-4 rounded-xl font-semibold flex items-center justify-center hover:opacity-90 transition shadow-lg"
        >
          <FileText className="w-5 h-5 inline mr-2" />
          Open / Download Policy
        </button>
      </div>

      {/* VIEW PLANS */}
      <div className="px-6 mb-6">
        <Link to="/premium">
          <button className="w-full bg-gradient-to-r from-[#134074] to-[#0b2545] text-white py-3 rounded-xl font-semibold">
            <Shield className="w-5 h-5 inline mr-2" />
            View Plans
          </button>
        </Link>
      </div>

      {/* WARNING */}
      <div className="px-6 mb-6">
        <div className="bg-[#8da9c4]/20 rounded-xl p-4 border border-[#8da9c4]/50 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#134074] mt-0.5" />
          <p className="text-sm text-[#13315c]">
            <span className="font-semibold">Free Look Period:</span> Cancel within 30 days for full refund.
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}