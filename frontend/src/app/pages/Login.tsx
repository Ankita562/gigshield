import { Shield, Phone, ArrowRight, AlertCircle, Loader2, KeyRound } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../config";
import { useAuth } from "../../contexts/AuthContext";

export function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (step === 2 && timer === 0) {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  const handleSendOTP = async () => {
    setError("");
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2);
      setTimer(30);
      setCanResend(false);
    }, 1000);
  };

  const handleVerifyOTP = async () => {
    setError("");
    setIsSubmitting(true);

    if (otp !== "1234") {
      setError("Invalid verification code. Please try again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        throw new Error("Server returned an invalid response. Please try again.");
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      const existingUser = JSON.parse(localStorage.getItem("gigshield_user") || "{}");
      const mergedUser = {
        ...existingUser,
        ...data.user,
      };

      login(mergedUser, data.token);
      localStorage.setItem("gigshield_user", JSON.stringify(mergedUser));
      localStorage.setItem("token", data.token);

      let fetchedPolicy = data.policy;
      if (!fetchedPolicy && data.token) {
        try {
          const policyRes = await fetch(`${API_BASE}/api/user/policy`, {
            headers: { Authorization: `Bearer ${data.token}` },
          });
          if (policyRes.ok) fetchedPolicy = await policyRes.json();
        } catch (err) {
          console.warn("Policy fetch failed, continuing");
        }
      }

      if (fetchedPolicy) {
        localStorage.setItem("gigshield_policy", JSON.stringify(fetchedPolicy));
      }

      const hasPlan = !!mergedUser.planType;

      if (hasPlan) {
        navigate("/home", { replace: true });
      } else {
        navigate("/premium", { replace: true });
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start px-2 py-4 font-sans">
      <div className="w-full max-w-[300px] mx-auto">
        <div className="bg-gradient-to-br from-[#134074] via-[#13315c] to-[#0b2545] text-white px-4 pt-8 pb-8 transition-all duration-500">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">GigKavach</h1>
              <p className="text-[10px] text-[#8da9c4] uppercase tracking-wider">
                Income Protection
              </p>
            </div>
          </div>

          <h2 className="text-lg font-semibold mt-2">
            {step === 1 ? "Welcome Back 👋" : "Verify Number 🛡️"}
          </h2>

          <p className="text-xs text-[#8da9c4] mt-1">
            {step === 1
              ? "Login to access your dashboard"
              : `Code sent to +91 ${phone}`}
          </p>
        </div>

        <div className="px-4 -mt-6">
          <div className="bg-white rounded-2xl p-4 shadow-md border border-[#8da9c4]/20">
            {error && (
              <div className="mb-4 bg-rose-50 border border-rose-100 p-2 rounded-lg flex gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <p className="text-xs text-rose-700">{error}</p>
              </div>
            )}

            {step === 1 ? (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-semibold text-[#13315c] uppercase mb-1 block">
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#134074]" />
                    <div className="absolute left-10 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#13315c] border-r border-gray-300 pr-2">
                      +91
                    </div>

                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      placeholder="9876543210"
                      className="w-full pl-[72px] pr-3 py-3 text-sm bg-[#f8fafc] border border-[#8da9c4]/30 rounded-xl focus:outline-none focus:border-[#134074]"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendOTP}
                  disabled={isSubmitting || phone.length < 10}
                  className="w-full bg-gradient-to-r from-[#134074] to-[#0b2545] text-white py-3 rounded-xl text-sm font-semibold flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <>
                      Continue <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-semibold text-[#13315c] uppercase mb-1 block">
                    Verification Code
                  </label>

                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#134074]" />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      placeholder="Enter OTP"
                      className="w-full pl-10 pr-3 py-3 text-sm bg-[#f8fafc] border border-[#8da9c4]/30 rounded-xl text-center tracking-widest"
                      maxLength={4}
                    />
                  </div>
                </div>

                <button
                  onClick={handleVerifyOTP}
                  disabled={isSubmitting || otp.length < 4}
                  className="w-full bg-[#134074] text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin w-4 h-4 mx-auto" />
                  ) : (
                    "Verify"
                  )}
                </button>

                <div className="flex justify-between text-[10px]">
                  <button
                    onClick={() => {
                      setStep(1);
                      setOtp("");
                      setError("");
                      setIsSubmitting(false);
                    }}
                  >
                    Edit
                  </button>

                  {canResend ? (
                    <button
                      onClick={() => {
                        setTimer(30);
                        setCanResend(false);
                        setOtp("");
                      }}
                    >
                      Resend
                    </button>
                  ) : (
                    <span>{timer}s</span>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t text-center">
              <p
                onClick={() => navigate("/signup")}
                className="text-xs font-semibold text-[#134074] cursor-pointer"
              >
                New user? <span className="underline">Create account</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}