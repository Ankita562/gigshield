import { MobileLayout } from '../components/MobileLayout';
import { Shield, User, Users, Phone, Briefcase, Wallet, ChevronRight, CheckCircle, Info } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigate } from "react-router-dom";

export function RequireAuth({ children }: { children: ReactNode }) {
  const user = localStorage.getItem("gigshield_user");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
export function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nominee: '',
    phone: '',
    platformId: '',
    upiId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const platforms = [
    'Zomato',
    'Swiggy',
    'Dunzo',
    'Blinkit',
    'Zepto',
    'Other',
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!isLogin && !formData.nominee.trim()) {
      newErrors.nominee = 'Nominee name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Enter valid 10-digit mobile number';
    }

    if (!isLogin && !formData.platformId.trim()) {
      newErrors.platformId = 'Platform ID is required';
    }

    if (!formData.upiId.trim()) {
      newErrors.upiId = 'UPI ID is required';
    } else if (!/^[\w.-]+@[\w.-]+$/.test(formData.upiId)) {
      newErrors.upiId = 'Enter valid UPI ID (e.g., name@paytm)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        navigate('/premium');
      }, 1500);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isSubmitting) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-gradient-to-br from-[#eef4ed] to-[#8da9c4]/20 flex items-center justify-center px-6">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-[#8da9c4]/40 text-center max-w-sm">
            <div className="w-20 h-20 bg-gradient-to-br from-[#134074] to-[#0b2545] rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-[#0b2545] mb-2">Creating Your Account</h2>
            <p className="text-[#13315c]">
              Setting up your GigShield protection...
            </p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#134074] via-[#13315c] to-[#0b2545] text-white px-6 pt-12 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8da9c4] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0b2545] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <Shield className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">GigShield</h1>
              <p className="text-[#8da9c4] text-xs">Income Protection for Gig Workers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Login/Signup */}
      <div className="px-6 -mt-8 mb-6 relative z-20">
        <div className="bg-[#eef4ed] rounded-2xl p-2 flex gap-2 border border-[#8da9c4]/40 shadow-lg">
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              !isLogin
                ? 'bg-gradient-to-r from-[#134074] to-[#0b2545] text-white shadow-md'
                : 'text-[#13315c] hover:bg-white/50'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              isLogin
                ? 'bg-gradient-to-r from-[#134074] to-[#0b2545] text-white shadow-md'
                : 'text-[#13315c] hover:bg-white/50'
            }`}
          >
            Login
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-2xl p-6 border border-[#8da9c4]/40 shadow-sm">
          <h2 className="text-xl font-bold text-[#0b2545] mb-1">
            {isLogin ? 'Welcome Back' : 'Get Started'}
          </h2>
          <p className="text-sm text-[#13315c]/70 mb-6">
            {isLogin ? 'Login to access your policy' : 'Create your account in 2 minutes'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-[#0b2545] mb-2">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#134074]" strokeWidth={2} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className={`w-full pl-12 pr-4 py-3.5 bg-[#eef4ed] border-2 ${
                    errors.name ? 'border-rose-500' : 'border-[#8da9c4]/40'
                  } rounded-xl text-[#0b2545] placeholder:text-[#13315c]/40 focus:outline-none focus:border-[#134074] transition-colors`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-rose-600 mt-1.5 ml-1">{errors.name}</p>
              )}
            </div>

            {/* Nominee - Only for signup */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-[#0b2545] mb-2">
                  Nominee Name <span className="text-rose-500">*</span>
                  <span className="ml-2 group relative inline-block">
                    <Info className="inline w-3.5 h-3.5 text-[#13315c]/60 cursor-help" strokeWidth={2} />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-56 bg-[#0b2545] text-white text-xs rounded-lg p-2.5 shadow-xl z-10">
                      Required by IRDAI. Your nominee will receive benefits in case of unforeseen circumstances.
                    </span>
                  </span>
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#134074]" strokeWidth={2} />
                  <input
                    type="text"
                    value={formData.nominee}
                    onChange={(e) => handleChange('nominee', e.target.value)}
                    placeholder="Enter nominee's full name"
                    className={`w-full pl-12 pr-4 py-3.5 bg-[#eef4ed] border-2 ${
                      errors.nominee ? 'border-rose-500' : 'border-[#8da9c4]/40'
                    } rounded-xl text-[#0b2545] placeholder:text-[#13315c]/40 focus:outline-none focus:border-[#134074] transition-colors`}
                  />
                </div>
                {errors.nominee && (
                  <p className="text-xs text-rose-600 mt-1.5 ml-1">{errors.nominee}</p>
                )}
              </div>
            )}

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-[#0b2545] mb-2">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#134074]" strokeWidth={2} />
                <div className="absolute left-12 top-1/2 -translate-y-1/2 text-[#13315c] font-semibold">
                  +91
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  className={`w-full pl-[88px] pr-4 py-3.5 bg-[#eef4ed] border-2 ${
                    errors.phone ? 'border-rose-500' : 'border-[#8da9c4]/40'
                  } rounded-xl text-[#0b2545] placeholder:text-[#13315c]/40 focus:outline-none focus:border-[#134074] transition-colors`}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-rose-600 mt-1.5 ml-1">{errors.phone}</p>
              )}
            </div>

            {/* Platform & ID - Only for signup */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-[#0b2545] mb-2">
                  Platform & ID <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={formData.platformId.split(':')[0] || ''}
                    onChange={(e) => {
                      const platform = e.target.value;
                      const id = formData.platformId.split(':')[1] || '';
                      handleChange('platformId', platform ? `${platform}:${id}` : '');
                    }}
                    className="px-4 py-3.5 bg-[#eef4ed] border-2 border-[#8da9c4]/40 rounded-xl text-[#0b2545] focus:outline-none focus:border-[#134074] transition-colors"
                  >
                    <option value="">Select Platform</option>
                    {platforms.map((platform) => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#134074]" strokeWidth={2} />
                    <input
                      type="text"
                      value={formData.platformId.split(':')[1] || ''}
                      onChange={(e) => {
                        const platform = formData.platformId.split(':')[0] || '';
                        handleChange('platformId', platform ? `${platform}:${e.target.value}` : e.target.value);
                      }}
                      placeholder="Your ID"
                      className={`w-full pl-12 pr-4 py-3.5 bg-[#eef4ed] border-2 ${
                        errors.platformId ? 'border-rose-500' : 'border-[#8da9c4]/40'
                      } rounded-xl text-[#0b2545] placeholder:text-[#13315c]/40 focus:outline-none focus:border-[#134074] transition-colors`}
                    />
                  </div>
                </div>
                {errors.platformId && (
                  <p className="text-xs text-rose-600 mt-1.5 ml-1">{errors.platformId}</p>
                )}
              </div>
            )}

            {/* UPI ID */}
            <div>
              <label className="block text-sm font-semibold text-[#0b2545] mb-2">
                UPI ID <span className="text-rose-500">*</span>
                <span className="ml-2 text-xs font-normal text-[#13315c]/60">(for instant payouts)</span>
              </label>
              <div className="relative">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#134074]" strokeWidth={2} />
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={(e) => handleChange('upiId', e.target.value.toLowerCase())}
                  placeholder="yourname@paytm"
                  className={`w-full pl-12 pr-4 py-3.5 bg-[#eef4ed] border-2 ${
                    errors.upiId ? 'border-rose-500' : 'border-[#8da9c4]/40'
                  } rounded-xl text-[#0b2545] placeholder:text-[#13315c]/40 focus:outline-none focus:border-[#134074] transition-colors`}
                />
              </div>
              {errors.upiId && (
                <p className="text-xs text-rose-600 mt-1.5 ml-1">{errors.upiId}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#134074] to-[#0b2545] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-3 group mt-6"
            >
              <Shield className="w-6 h-6" strokeWidth={2.5} />
              {isLogin ? 'Login to GigShield' : 'Continue to Plans'}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>

      {/* IRDAI Notice */}
      {!isLogin && (
        <div className="px-6 mb-6">
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
            <div>
              <p className="text-sm text-emerald-900 font-semibold mb-1">IRDAI Compliant Registration</p>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Your data is encrypted and stored securely. We collect only the minimum information required by insurance regulations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Benefits List */}
      {!isLogin && (
        <div className="px-6 mb-6">
          <div className="bg-[#8da9c4]/20 rounded-2xl p-5 border border-[#8da9c4]/50">
            <p className="font-bold text-[#0b2545] mb-3 text-base">Why 50,000+ delivery partners trust GigShield</p>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#134074] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
                <span className="text-sm text-[#13315c]">Zero-touch automatic claims - No paperwork ever</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#134074] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
                <span className="text-sm text-[#13315c]">Instant payouts in under 5 minutes to your UPI</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#134074] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
                <span className="text-sm text-[#13315c]">Weekly premiums starting at just ₹30</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#134074] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
                <span className="text-sm text-[#13315c]">Cancel anytime with 30-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms */}
      <div className="px-6 mb-8">
        <p className="text-xs text-[#13315c]/60 text-center leading-relaxed">
          By continuing, you agree to our{' '}
          <span className="text-[#134074] font-semibold underline">Terms of Service</span> and{' '}
          <span className="text-[#134074] font-semibold underline">Privacy Policy</span>
        </p>
      </div>
    </MobileLayout>
  );
}
