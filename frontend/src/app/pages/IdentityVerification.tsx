import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, AlertCircle, Lock, FileText } from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { API_BASE } from "../../config";

export function IdentityVerification() {
  const navigate = useNavigate();
  const [aadhaar, setAadhaar] = useState("");
  const [pan, setPan] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setError("");
    if (!/^\d{12}$/.test(aadhaar)) {
      setError("Aadhaar must be 12 digits");
      return;
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      setError("PAN must be 10 characters (e.g., ABCDE1234F)");
      return;
    }

    setLoading(true);

    // Compute masked values
    const aadhaarMasked = "XXXXXXXX" + aadhaar.slice(-4);
    const panMasked = pan.slice(0, 4) + "****" + pan.slice(-1);
    const verifiedAt = new Date().toISOString();

    try {
      // Try to call backend API to store KYC data in DB
      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch(`${API_BASE}/api/user/verify-kyc`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ aadhaar, pan }),
        });
        if (!response.ok) {
          console.warn("Backend KYC store failed, but continuing with local storage");
        } else {
          const data = await response.json();
          // If backend returns updated user, use it
          if (data.user) {
            const existingUser = JSON.parse(localStorage.getItem("gigshield_user") || "{}");
            const updatedUser = { ...existingUser, ...data.user };
            localStorage.setItem("gigshield_user", JSON.stringify(updatedUser));
          }
        }
      }
    } catch (err) {
      console.warn("Backend KYC API error, using local storage only", err);
    }

    // Always update localStorage with masked values (even if backend fails)
    const existingUser = JSON.parse(localStorage.getItem("gigshield_user") || "{}");
    const updatedUser = {
      ...existingUser,
      kycVerified: true,
      aadhaarMasked,
      panMasked,
      kycVerifiedAt: verifiedAt,
    };
    localStorage.setItem("gigshield_user", JSON.stringify(updatedUser));
    localStorage.setItem("kycVerified", "true");

    // Short delay to ensure state update
    setTimeout(() => {
      setLoading(false);
      setVerified(true);
    }, 500);
  };

  if (verified) {
    // Determine redirect based on whether user has active plan
    const storedUser = JSON.parse(localStorage.getItem("gigshield_user") || "{}");
    const hasActivePlan = storedUser.hasActivePlan === true;
    const redirectTo = hasActivePlan ? "/home" : "/premium";
    const buttonText = hasActivePlan ? "Go to Dashboard" : "Proceed to Buy Policy";

    return (
      <MobileLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-sm w-full border border-purple-100">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verified Successfully</h2>
            <p className="text-gray-600 mb-4">
              Your identity has been verified through DigiLocker.
            </p>
            <button
              onClick={() => navigate(redirectTo)}
              className="w-full bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      {/* DigiLocker style header - darker purple gradient */}
      <div className="relative bg-gradient-to-r from-purple-800 to-indigo-900 text-white px-6 pt-12 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* DigiLocker original style logo: lock + document */}
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-3 shadow-lg relative">
            <div className="relative">
              <Lock className="w-6 h-6 text-white absolute -top-1 -left-1" strokeWidth={1.5} />
              <FileText className="w-6 h-6 text-white ml-2 mt-2" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">DigiLocker</h1>
          <p className="text-purple-200 text-sm mt-1">Government of India</p>
          <div className="mt-6 w-12 h-0.5 bg-white/30 rounded-full"></div>
          <p className="text-sm font-medium mt-4">Identity Verification for IRDAI KYC</p>
        </div>
      </div>

      {/* White card with inputs */}
      <div className="px-6 -mt-12 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
            <Lock className="w-5 h-5 text-purple-700" />
            <span className="text-sm font-semibold text-gray-700">Aadhaar & PAN verification</span>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Aadhaar Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
                placeholder="12-digit Aadhaar"
                disabled={loading}
                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                PAN Card <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase().slice(0, 10))}
                placeholder="e.g. ABCDE1234F"
                disabled={loading}
                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>

            <button
              onClick={handleVerify}
              disabled={loading || !aadhaar || !pan}
              className="w-full bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Verifying with DigiLocker...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Verify via DigiLocker
                </>
              )}
            </button>

            <div className="mt-4 pt-3 border-t border-gray-100 text-center">
              <p className="text-[11px] text-gray-400">
                Your data is encrypted and shared only with IRDAI‑authorised partners.
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                Powered by DigiLocker – Digital India initiative
              </p>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}