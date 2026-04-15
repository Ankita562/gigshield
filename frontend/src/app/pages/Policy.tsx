import React, { useEffect, useState } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { Shield, FileText, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../../config';

export function Policy() {
  const [policy, setPolicy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const policyPdf = '/gigangelpolicy.pdf';

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('gigshield_user') || 'null');
    const savedPolicy = localStorage.getItem('gigshield_policy');

    // 1. Priority: Load from local storage for consistency with Home screen
    if (savedPolicy) {
      setPolicy(JSON.parse(savedPolicy));
    }

    if (!user?._id && !user?.id) {
      setLoading(false);
      return;
    }

    // 2. Fetch fresh data from server
    fetch(`${API_BASE}/api/policy/${user._id || user.id}`)
      .then((res) => res.json())
      .then((data) => {
        const freshPolicy = data?.policy || (data && !data.message ? data : null);
        if (freshPolicy) {
          setPolicy(freshPolicy);
          localStorage.setItem('gigshield_policy', JSON.stringify(freshPolicy));
        }
      })
      .catch((err) => console.error('Fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  // Data mapping
  const displayData = {
    planName: policy?.planType || policy?.plan || "Standard Plan",
    status: policy?.status || (policy?.isActive ? "active" : "inactive"),
    premium: policy?.amount || policy?.price || policy?.premium || (policy ? 45 : 0),
    coverage: policy?.payout || policy?.coverage || (policy ? 600 : 0),
    uin: policy?.uin || 'IRDAI-GS-2026-V1',
    startDate: policy?.startDate || 'March 2026',
    riskMultiplier: policy?.riskMultiplier || 1,
  };

  const premiumValue = Number(displayData.premium);

  if (loading && !policy) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-[#13315C] font-black italic">LOADING POLICY...</div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      {/* Header - matches unified gradient theme */}
      <div className="relative bg-gradient-to-br from-[#134074] via-[#13315c] to-[#0b2545] text-white px-6 pt-12 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8da9c4] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0b2545] rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight mb-1">My Policy</h1>
          <p className="text-[#8da9c4] text-sm">{displayData.planName}</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="px-6 -mt-10 mb-6 relative z-20">
        {!policy ? (
          <div className="bg-[#eef4ed] rounded-2xl border border-[#8da9c4]/40 shadow-2xl p-8 text-center">
            <Shield className="w-12 h-12 text-[#8da9c4] mx-auto mb-3" />
            <p className="text-[#13315c] font-semibold">No active policy found.</p>
            <Link to="/premium" className="text-[#134074] font-bold mt-4 block underline text-sm">View Plans</Link>
          </div>
        ) : (
          <div className="bg-[#eef4ed] rounded-2xl border border-[#8da9c4]/40 shadow-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#134074] rounded-xl flex items-center justify-center shadow-md">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-[#13315c]/70 uppercase font-bold tracking-wider">Policy UIN</p>
                <p className="font-bold text-[#0b2545] text-sm">{displayData.uin}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-[#8da9c4]/30 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-[#13315c]/70 font-bold uppercase mb-1">Coverage</p>
                <p className="font-bold text-[#0b2545] text-2xl">₹{displayData.coverage}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#13315c]/70 font-bold uppercase mb-1">Status</p>
                <div className="flex items-center justify-end gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <p className="font-bold text-emerald-600 uppercase text-xs">{displayData.status}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Premium Summary */}
      {policy && (
        <div className="px-6 mb-6 relative z-20">
          <h2 className="text-xs font-bold text-[#0b2545] uppercase tracking-wide mb-3">Premium Summary</h2>
          <div className="bg-[#eef4ed] rounded-2xl border border-[#8da9c4]/40 p-5 shadow-sm">
            <div className="flex justify-between items-end mb-5">
              <div>
                <p className="text-[10px] font-bold text-[#13315c]/70 uppercase mb-1">Weekly Premium</p>
                <p className="text-3xl font-bold text-[#0b2545]">₹{displayData.premium}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-[#13315c]/70 uppercase mb-1">Multiplier</p>
                <p className="text-lg font-bold text-[#134074]">{displayData.riskMultiplier}x</p>
              </div>
            </div>
            <div className="space-y-2 pt-3 border-t border-[#8da9c4]/30">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#13315c]/70">Base Coverage</span>
                <span className="text-[#0b2545]">₹{premiumValue + 6}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#13315c]/70">Platform Subsidy</span>
                <span className="text-emerald-600">-₹6</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="px-6 space-y-3 mb-10 relative z-20">
        <button
          onClick={() => window.open(policyPdf, '_blank')}
          className="w-full bg-[#134074] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wide shadow-md flex items-center justify-center gap-2 transition active:scale-95"
        >
          <FileText size={18} /> View Policy Document
        </button>
        <Link to="/premium">
          <button className="w-full bg-white border-2 border-[#134074] text-[#134074] py-4 rounded-xl font-bold text-sm uppercase tracking-wide transition active:scale-95">
            Upgrade / Change Plan
          </button>
        </Link>
      </div>
    </MobileLayout>
  );
}