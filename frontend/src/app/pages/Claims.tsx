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
    const token = localStorage.getItem("token");

    fetch(`${API_BASE}/api/claims/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
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
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#134074] via-[#13315c] to-[#0b2545] text-white px-6 pt-12 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8da9c4] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0b2545] rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight mb-1">My Claims</h1>
          <p className="text-[#d7e3f1] text-sm">Automatic Payout History</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-12 pb-28 relative z-20">
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
          <div className="space-y-4">
            {claims.map((claim, index) => {
              const isApproved = claim.status === "approved";
              const amount = isApproved ? `₹${claim.amountInr || 0}` : "₹0";
              const reason =
                claim.claimType || claim.reason || "Automatic weather trigger";
              const dateValue = claim.timestamp || claim.createdAt;

              return (
                <div
                  key={claim._id || index}
                  className={`rounded-2xl p-4 border shadow-sm ${
                    isApproved
                      ? "bg-[#eef4ed] border-[#8da9c4]/40"
                      : "bg-rose-50/70 border-rose-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-2xl font-bold text-[#0b2545]">{amount}</p>
                      <p className="text-sm text-[#13315c] mt-1">
                        Reason:{" "}
                        <span className="font-semibold text-[#0b2545]">
                          {reason}
                        </span>
                      </p>
                      <p className="text-xs text-[#13315c]/60 mt-2">
                        {dateValue
                          ? new Date(dateValue).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Date unavailable"}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {isApproved ? (
                        <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-semibold text-emerald-700">
                            Approved
                          </span>
                        </div>
                      ) : (
                        <div className="rounded-full bg-rose-100 px-3 py-1">
                          <span className="text-sm font-semibold text-rose-700">
                            Rejected
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
