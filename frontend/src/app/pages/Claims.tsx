import { MobileLayout } from '../components/MobileLayout';
import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { API_BASE } from '../../config';

export function Claims() {
  const [claims, setClaims] = useState<any[]>([]);
  // const user = JSON.parse(localStorage.getItem("gigshield_user") || "null");
  const[user,setUser]=useState<any>(null);
  useEffect(()=>{
    const storedUser=localStorage.getItem("gigshield_user");
    if(storedUser){
      setUser(JSON.parse(storedUser));
    }
  },[]);

  useEffect(() => {
    if (!user?._id) return;

    fetch(`${API_BASE}/api/claims/${user._id}`)
      .then(res => res.json())
      .then(data => setClaims(data))
      .catch(err => console.log(err));
  }, [user]);

  return (
    <MobileLayout>
      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#134074] via-[#13315c] to-[#0b2545] text-white px-6 pt-12 pb-8">
        <h1 className="text-2xl font-bold mb-2">My Claims</h1>
        <p className="text-[#8da9c4] text-sm">Auto-payout history</p>
      </div>

      {/* CONTENT */}
      <div className="px-6 -mt-4">
        {claims.length === 0 ? (
          <div className="bg-[#eef4ed] rounded-xl p-6 text-center border border-[#8da9c4]/40 shadow-sm">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-[#134074]" />
            <p className="text-[#0b2545] font-semibold">No claims yet</p>
            <p className="text-sm text-[#13315c]/70">
              Payouts will appear here automatically
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {claims.map((claim, index) => (
              // <div
              //   key={index}
              //   className="bg-[#eef4ed] border border-[#8da9c4]/40 rounded-xl p-4 shadow-sm"
              // >
              //   {/* TOP */}
              //   <div className="flex justify-between items-center mb-2">
              //     <p className="text-xl font-bold text-[#0b2545]">
              //       ₹{claim.amount}
              //     </p>
              //     <div className="flex items-center gap-1 text-emerald-600 text-sm font-semibold">
              //       <CheckCircle className="w-4 h-4" />
              //       Approved
              //     </div>
              //   </div>

              //   {/* REASON */}
              //   <p className="text-sm text-[#13315c]">
              //     Reason:{" "}
              //     <span className="font-semibold text-[#0b2545]">
              //       {claim.reason}
              //     </span>
              //   </p>

              //   {/* DATE */}
              //   <p className="text-xs text-[#8da9c4] mt-1">
              //     {new Date(claim.createdAt).toLocaleString()}
              //   </p>
              // </div>
              <div
  key={index}
  className={`rounded-xl p-4 border ${
    claim.status === "rejected"
      ? "bg-red-50 border-red-300"
      : "bg-[#eef4ed] border-[#8da9c4]/40"
  }`}
>
  <div className="flex justify-between items-center mb-2">
    <p className="text-xl font-bold text-[#0b2545]">
      {claim.status === "approved" ? `₹${claim.amount}` : "₹0"}
    </p>

    <p
      className={`text-sm font-semibold ${
        claim.status === "approved"
          ? "text-emerald-600"
          : "text-red-600"
      }`}
    >
      {claim.status === "approved" ? "Approved ✅" : "Rejected ❌"}
    </p>
  </div>

  <p className="text-sm text-[#13315c]">
    Reason: <span className="font-semibold">{claim.reason}</span>
  </p>

  <p className="text-xs text-gray-500 mt-1">
    {new Date(claim.createdAt).toLocaleString()}
  </p>
</div>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}