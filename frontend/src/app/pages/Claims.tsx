import { MobileLayout } from '../components/MobileLayout';
import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { API_BASE } from '../../config';

export function Claims() {
  const [claims, setClaims] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("gigshield_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("User parse error", err);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user?._id && !user?.id) {
      setLoading(false);
      return;
    }

    const userId = user._id || user.id;

    fetch(`${API_BASE}/api/claims/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setClaims(data);
        } else if (Array.isArray(data?.claims)) {
          setClaims(data.claims);
        } else {
          setClaims([]);
        }
      })
      .catch((err) => {
        console.error("Fetch claims error:", err);
        setClaims([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <MobileLayout>
      {/* Header - matches unified gradient theme */}
      <div className="relative bg-gradient-to-br from-[#134074] via-[#13315c] to-[#0b2545] text-white px-6 pt-12 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8da9c4] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0b2545] rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight mb-1">My Claims</h1>
          <p className="text-[#8da9c4] text-sm">Automatic Payout History</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-10 pb-28 relative z-20">
        {loading ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-xl border border-[#8da9c4]/30 flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#134074] mb-4"></div>
            <p className="text-[#13315c] font-medium">Fetching history...</p>
          </div>
        ) : claims.length === 0 ? (
          <div className="bg-[#eef4ed] rounded-2xl p-8 text-center border border-[#8da9c4]/40 shadow-lg">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <AlertCircle className="w-8 h-8 text-[#134074]/40" />
            </div>
            <p className="text-[#0b2545] font-bold text-lg">No claims yet</p>
            <p className="text-sm text-[#13315c]/70 mt-1">
              Payouts will appear here automatically when conditions are met.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {claims.map((claim, index) => (
              <div
                key={claim._id || index}
                className={`rounded-xl p-4 border shadow-sm ${
                  claim.status === "rejected"
                    ? "bg-rose-50/50 border-rose-200"
                    : "bg-[#eef4ed] border-[#8da9c4]/40"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xl font-bold text-[#0b2545]">
                    {claim.status === "approved" ? `₹${claim.amount || 0}` : "₹0"}
                  </p>
                  <div className="flex items-center gap-1">
                    {claim.status === "approved" ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-semibold text-emerald-600">Approved</span>
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-rose-600">Rejected</span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-[#13315c]">
                  Reason: <span className="font-semibold text-[#0b2545]">{claim.reason || "Automatic weather trigger"}</span>
                </p>
                <p className="text-xs text-[#13315c]/60 mt-1">
                  {claim.createdAt
                    ? new Date(claim.createdAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : "Date unavailable"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}