import { MobileLayout } from '../components/MobileLayout';
import {
  Shield, User, Phone, Wallet, Calendar,
  CheckCircle, AlertCircle, Lock, FileText, Fingerprint, LogOut, RefreshCw, ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadUserData = () => {
    const userData = localStorage.getItem('gigshield_user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadUserData();
  }, [navigate]);

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      localStorage.clear();
      navigate('/login', { replace: true });
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadUserData();
    }, 300);
  };

  const goToKYC = () => {
    navigate('/verify-identity');
  };

  if (loading) {
    return (
      <MobileLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#134074]"></div>
        </div>
      </MobileLayout>
    );
  }

  if (!user) return null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not verified';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <MobileLayout>
      {/* Header with Sign Out and Refresh buttons */}
      <div className="relative bg-gradient-to-br from-[#134074] via-[#13315c] to-[#0b2545] text-white px-6 pt-12 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8da9c4] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0b2545] rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <User className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex flex-col items-center gap-1 p-2 bg-white/10 rounded-xl hover:bg-white/20 transition disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="text-[10px] font-medium">Refresh</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex flex-col items-center gap-1 p-2 bg-white/10 rounded-xl hover:bg-white/20 transition"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-[10px] font-medium">Sign Out</span>
              </button>
            </div>
          </div>
          <p className="text-[#8da9c4] text-sm ml-1">Manage your account & KYC</p>
        </div>
      </div>

      <div className="px-6 -mt-12 mb-6 space-y-4 relative z-20">
        {/* Personal Information Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#8da9c4]/40 overflow-hidden">
          <div className="bg-gradient-to-r from-[#134074]/10 to-[#13315c]/10 px-5 py-4 border-b border-[#8da9c4]/30">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#134074]" strokeWidth={2.5} />
              <h2 className="font-bold text-[#0b2545]">Personal Information</h2>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#13315c]/70">Full Name</span>
              <span className="text-sm font-semibold text-[#0b2545]">{user.name || '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#13315c]/70">Phone Number</span>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#134074]" strokeWidth={2} />
                <span className="text-sm font-semibold text-[#0b2545]">+91 {user.phone}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#13315c]/70">Nominee</span>
              <span className="text-sm font-semibold text-[#0b2545]">{user.nominee || '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#13315c]/70">Platform ID</span>
              <span className="text-sm font-semibold text-[#0b2545]">{user.platform_id || '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#13315c]/70">UPI ID</span>
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#134074]" strokeWidth={2} />
                <span className="text-sm font-semibold text-[#0b2545]">{user.upi_id || '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* KYC Details Card – IRDAI Compliance */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#8da9c4]/40 overflow-hidden">
          <div className="bg-gradient-to-r from-[#134074]/10 to-[#13315c]/10 px-5 py-4 border-b border-[#8da9c4]/30">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-[#134074]" strokeWidth={2.5} />
              <h2 className="font-bold text-[#0b2545]">KYC Verification (IRDAI Mandate)</h2>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {/* KYC Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#13315c]/70">Verification Status</span>
              <div className="flex items-center gap-2">
                {user.kycVerified ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">Verified</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-700">Pending</span>
                  </>
                )}
              </div>
            </div>

            {/* Masked Aadhaar */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#13315c]/70">Aadhaar Number</span>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#134074]" strokeWidth={2} />
                <span className="text-sm font-mono font-semibold text-[#0b2545]">
                  {user.aadhaarMasked || 'XXXX-XXXX-XXXX'}
                </span>
              </div>
            </div>

            {/* Masked PAN */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#13315c]/70">PAN Card</span>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#134074]" strokeWidth={2} />
                <span className="text-sm font-mono font-semibold text-[#0b2545]">
                  {user.panMasked || 'XXXXX0000X'}
                </span>
              </div>
            </div>

            {/* Verification Date */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#13315c]/70">Verified On</span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#134074]" strokeWidth={2} />
                <span className="text-sm font-semibold text-[#0b2545]">
                  {formatDate(user.kycVerifiedAt)}
                </span>
              </div>
            </div>

            {/* IRDAI compliance note */}
            <div className="mt-4 pt-3 border-t border-[#8da9c4]/20 bg-emerald-50 rounded-xl p-3">
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                <span className="font-bold">✓ IRDAI Compliant</span> – Your identity has been verified as per Insurance Regulatory and Development Authority guidelines. KYC is mandatory for all policyholders.
              </p>
            </div>

            {/* ✅ Show Complete KYC button if not verified */}
            {!user.kycVerified && (
              <button
                onClick={goToKYC}
                className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
              >
                Complete KYC Verification
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Plan Details (if active) */}
        {user.hasActivePlan && (
          <div className="bg-white rounded-2xl shadow-lg border border-[#8da9c4]/40 overflow-hidden">
            <div className="bg-gradient-to-r from-[#134074]/10 to-[#13315c]/10 px-5 py-4 border-b border-[#8da9c4]/30">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#134074]" strokeWidth={2.5} />
                <h2 className="font-bold text-[#0b2545]">Active Policy</h2>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#13315c]/70">Plan Type</span>
                <span className="text-sm font-bold text-[#134074]">{user.planType || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#13315c]/70">Weekly Premium</span>
                <span className="text-sm font-bold text-[#134074]">₹{user.planPrice || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#13315c]/70">Rainfall Threshold</span>
                <span className="text-sm font-semibold text-[#0b2545]">{user.planThresholds?.rain}mm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#13315c]/70">AQI Threshold</span>
                <span className="text-sm font-semibold text-[#0b2545]">{user.planThresholds?.aqi}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#13315c]/70">Daily Payout</span>
                <span className="text-sm font-bold text-emerald-600">₹{user.planThresholds?.dailyPayout}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}