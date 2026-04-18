import { MobileLayout } from '../components/MobileLayout';
import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { API_BASE } from '../../config';

export function Claims() {
  const [claims, setClaims] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('gigshield_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('User parse error', err);
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
    const token = localStorage.getItem('token');

    fetch(`${API_BASE}/api/claims/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
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
        console.error('Fetch claims error:', err);
        setClaims([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <MobileLayout>
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#134074] via-[#13315c] to-[#0b2545] px-6 pt-12 pb-24 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#8da9c4] blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#0b2545] blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <h1 className="mb-1 text-3xl font-bold tracking-tight">My Claims</h1>
          <p className="text-sm text-[#d7e3f1]">Automatic Payout History</p>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 -mt-12 px-6 pb-28">
        {loading ? (
          <div className="flex flex-col items-center rounded-2xl border border-[#8da9c4]/30 bg-white p-10 text-center shadow-xl">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-[#134074]"></div>
            <p className="font-medium text-[#13315c]">Fetching history...</p>
          </div>
        ) : claims.length === 0 ? (
          <div className="rounded-2xl border border-[#8da9c4]/40 bg-white p-8 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <AlertCircle className="h-8 w-8 text-[#134074]/40" />
            </div>
            <p className="text-lg font-bold text-[#0b2545]">No claims yet</p>
            <p className="mt-1 text-sm text-[#13315c]/70">
              Payouts will appear here automatically when conditions are met.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {claims.map((claim, index) => {
              const isApproved = claim.status === 'approved';
              const amount = isApproved ? `₹${claim.amountInr || 0}` : '₹0';
              const reason =
                claim.claimType || claim.reason || 'Automatic weather trigger';
              const dateValue = claim.timestamp || claim.createdAt;

              return (
                <div
                  key={claim._id || index}
                  className={`rounded-2xl border bg-white p-4 shadow-md transition hover:shadow-lg ${
                    isApproved
                      ? 'border-[#8da9c4]/40'
                      : 'border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-2xl font-bold text-[#0b2545]">{amount}</p>

                      <p className="mt-1 text-sm text-[#13315c]">
                        Reason:{' '}
                        <span className="font-semibold text-[#0b2545]">
                          {reason}
                        </span>
                      </p>

                      <p className="mt-2 text-xs text-[#13315c]/60">
                        {dateValue
                          ? new Date(dateValue).toLocaleString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Date unavailable'}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {isApproved ? (
                        <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
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
