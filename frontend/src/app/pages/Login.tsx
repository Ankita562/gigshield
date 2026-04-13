// import { MobileLayout } from '../components/MobileLayout';
// import { Shield, User, Users, Phone, Briefcase, Wallet, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// export function Login() {
//   const [phone, setPhone] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const res = await fetch("${API_BASE}/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ phone })
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message);

//       localStorage.setItem("gigshield_user", JSON.stringify(data.user));
//       localStorage.setItem("gigshield_policy", JSON.stringify(data.policy));

//       navigate("/");
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <input
//         placeholder="Enter phone"
//         value={phone}
//         onChange={(e) => setPhone(e.target.value)}
//       />
//       <button onClick={handleLogin}>Login</button>

//       <p onClick={() => navigate("/signup")}>
//         New user? Create account
//       </p>

//       {error && <p>{error}</p>}
//     </div>
//   );
// }

import { MobileLayout } from '../components/MobileLayout';
import { Shield, Phone, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
export function Login() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
useEffect(() => {
  const user = localStorage.getItem("gigshield_user");

  if (user) {
    navigate("/"); // already logged in → go home
  }
}, []);
  const handleLogin = async () => {
    setError("");

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter valid 10-digit mobile number");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("${API_BASE}/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("gigshield_user", JSON.stringify(data.user));
      localStorage.setItem("gigshield_policy", JSON.stringify(data.policy));

      navigate("/");
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    // Replaced <MobileLayout> with a standard mobile-sized container
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#134074] via-[#13315c] to-[#0b2545] text-white px-6 pt-12 pb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">GigKavach</h1>
            <p className="text-[#8da9c4] text-xs">Income Protection</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-6">Welcome Back 👋</h2>
        <p className="text-[#8da9c4]">Login with your phone number</p>
      </div>

      {/* Form */}
      <div className="px-6 -mt-10">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-[#8da9c4]/40">

          {error && (
            <div className="mb-4 bg-rose-50 border border-rose-200 p-3 rounded-xl flex gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}

          <div className="mb-5">
            <label className="text-sm font-bold text-[#0b2545] mb-2 block">
              Phone Number
            </label>

            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#134074]" />
              <div className="absolute left-12 top-1/2 -translate-y-1/2 text-sm font-bold text-[#13315c]">
                +91
              </div>

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="9876543210"
                className="w-full pl-[88px] pr-4 py-3.5 bg-[#eef4ed] border-2 border-[#8da9c4]/40 rounded-xl focus:outline-none focus:border-[#134074]"
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#134074] to-[#0b2545] text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Logging in...
              </>
            ) : (
              <>
                Login
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Switch to Signup */}
          <p
            onClick={() => navigate("/signup")}
            className="text-center text-sm mt-4 text-[#134074] font-semibold cursor-pointer"
          >
            New user? Create account →
          </p>
        </div>
      </div>
    </div>
  );
}