import { MobileLayout } from '../components/MobileLayout';
import { Shield, User, Users, Phone, Briefcase, Wallet, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { API_BASE } from '../../config';


import { useNavigate } from 'react-router-dom';

export function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    nominee: '',
    phone: '',
    platform_id: '',
    upi_id: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const platforms = [
    'Zomato',
    'Swiggy',
    'Dunzo',
    'Blinkit',
    'Zepto',
    'Rapido',
    'Uber Eats',
    'Porter',
    'Other',
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.length < 3) {
      newErrors.name = 'Full name must be at least 3 characters';
    }

    if (!formData.nominee.trim() || formData.nominee.length < 3) {
      newErrors.nominee = 'Nominee name must be at least 3 characters';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Enter valid 10-digit mobile number starting with 6-9';
    }

    if (!formData.platform_id.trim()) {
      newErrors.platform_id = 'Platform ID is required';
    } else if (formData.platform_id.length < 3) {
      newErrors.platform_id = 'Platform ID must be at least 3 characters';
    }

    if (!formData.upi_id.trim()) {
      newErrors.upi_id = 'UPI ID is required';
    } else if (!/^[\w.-]+@[\w.-]+$/.test(formData.upi_id)) {
      newErrors.upi_id = 'Enter valid UPI ID (e.g., name@paytm)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Then replace the fetch line
const response = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Registration failed');
      // }

      // const data = await response.json();
      const text = await response.text();
console.log("RAW RESPONSE:", text);


let data;
try {
  data = JSON.parse(text);
} catch {
  throw new Error("Server returned invalid JSON");
}
      if (!data.user) {
  throw new Error(data.message || "Registration failed");
}
      // Store user data and policy in localStorage
      localStorage.setItem('gigshield_user', JSON.stringify(data.user));
      localStorage.setItem('gigshield_policy', JSON.stringify(data.policy));
      
      setSuccess(true);
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setApiError('');
  };

  if (success) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-gradient-to-br from-[#eef4ed] to-[#8da9c4]/20 flex items-center justify-center px-6">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-[#8da9c4]/40 text-center max-w-sm">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold text-[#0b2545] mb-2">Registration Successful!</h2>
            <p className="text-[#13315c] mb-4">
              Your GigShield account has been created successfully.
            </p>
            <div className="bg-[#eef4ed] rounded-xl p-4 border border-[#8da9c4]/40">
              <p className="text-sm text-[#13315c]/70 mb-1">Your Policy UIN</p>
              <p className="text-lg font-bold text-[#134074]">
                {JSON.parse(localStorage.getItem('gigshield_policy') || '{}').uin}
              </p>
            </div>
            <p className="text-sm text-[#13315c]/60 mt-4">Redirecting to dashboard...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#134074] via-[#13315c] to-[#0b2545] text-white px-6 pt-12 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8da9c4] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0b2545] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <Shield className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">GigShield</h1>
              <p className="text-[#8da9c4] text-xs">Income Protection for Gig Workers</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
            <p className="text-[#8da9c4]">Get protected in under 3 minutes</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="px-6 -mt-10 mb-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 border border-[#8da9c4]/40 shadow-2xl">
          
          {/* API Error Message */}
          {apiError && (
            <div className="mb-5 bg-rose-50 border-2 border-rose-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              <div>
                <p className="text-sm font-semibold text-rose-900 mb-1">Registration Failed</p>
                <p className="text-xs text-rose-800">{apiError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-[#0b2545] mb-2">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#134074]" strokeWidth={2} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                  className={`w-full pl-12 pr-4 py-3.5 bg-[#eef4ed] border-2 ${
                    errors.name ? 'border-rose-500' : 'border-[#8da9c4]/40'
                  } rounded-xl text-[#0b2545] placeholder:text-[#13315c]/40 focus:outline-none focus:border-[#134074] transition-colors disabled:opacity-50`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-rose-600 mt-1.5 ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" strokeWidth={2.5} />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Nominee Name */}
            <div>
              <label className="block text-sm font-bold text-[#0b2545] mb-2">
                Nominee Name <span className="text-rose-500">*</span>
                <span className="ml-2 text-xs font-normal text-[#13315c]/60">(IRDAI Requirement)</span>
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#134074]" strokeWidth={2} />
                <input
                  type="text"
                  value={formData.nominee}
                  onChange={(e) => handleChange('nominee', e.target.value)}
                  placeholder="Enter nominee's full name"
                  disabled={isSubmitting}
                  className={`w-full pl-12 pr-4 py-3.5 bg-[#eef4ed] border-2 ${
                    errors.nominee ? 'border-rose-500' : 'border-[#8da9c4]/40'
                  } rounded-xl text-[#0b2545] placeholder:text-[#13315c]/40 focus:outline-none focus:border-[#134074] transition-colors disabled:opacity-50`}
                />
              </div>
              {errors.nominee && (
                <p className="text-xs text-rose-600 mt-1.5 ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" strokeWidth={2.5} />
                  {errors.nominee}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-bold text-[#0b2545] mb-2">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#134074]" strokeWidth={2} />
                <div className="absolute left-12 top-1/2 -translate-y-1/2 text-[#13315c] font-bold text-sm">
                  +91
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  disabled={isSubmitting}
                  className={`w-full pl-[88px] pr-4 py-3.5 bg-[#eef4ed] border-2 ${
                    errors.phone ? 'border-rose-500' : 'border-[#8da9c4]/40'
                  } rounded-xl text-[#0b2545] placeholder:text-[#13315c]/40 focus:outline-none focus:border-[#134074] transition-colors disabled:opacity-50`}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-rose-600 mt-1.5 ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" strokeWidth={2.5} />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Platform ID */}
            <div>
              <label className="block text-sm font-bold text-[#0b2545] mb-2">
                Platform ID <span className="text-rose-500">*</span>
                <span className="ml-2 text-xs font-normal text-[#13315c]/60">(e.g., Zomato, Swiggy ID)</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={formData.platform_id.split('-')[0] || ''}
                  onChange={(e) => {
                    const platform = e.target.value;
                    const id = formData.platform_id.split('-')[1] || '';
                    handleChange('platform_id', platform ? `${platform}-${id}` : '');
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-3.5 bg-[#eef4ed] border-2 border-[#8da9c4]/40 rounded-xl text-[#0b2545] focus:outline-none focus:border-[#134074] transition-colors disabled:opacity-50 font-semibold"
                >
                  <option value="">Platform</option>
                  {platforms.map((platform) => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#134074]" strokeWidth={2} />
                  <input
                    type="text"
                    value={formData.platform_id.split('-')[1] || ''}
                    onChange={(e) => {
                      const platform = formData.platform_id.split('-')[0] || '';
                      const id = e.target.value.toUpperCase();
                      handleChange('platform_id', platform ? `${platform}-${id}` : id);
                    }}
                    placeholder="ID"
                    disabled={isSubmitting}
                    className={`w-full pl-12 pr-4 py-3.5 bg-[#eef4ed] border-2 ${
                      errors.platform_id ? 'border-rose-500' : 'border-[#8da9c4]/40'
                    } rounded-xl text-[#0b2545] placeholder:text-[#13315c]/40 focus:outline-none focus:border-[#134074] transition-colors uppercase font-mono disabled:opacity-50`}
                  />
                </div>
              </div>
              {errors.platform_id && (
                <p className="text-xs text-rose-600 mt-1.5 ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" strokeWidth={2.5} />
                  {errors.platform_id}
                </p>
              )}
            </div>

            {/* UPI ID */}
            <div>
              <label className="block text-sm font-bold text-[#0b2545] mb-2">
                UPI ID <span className="text-rose-500">*</span>
                <span className="ml-2 text-xs font-normal text-[#13315c]/60">(for instant payouts)</span>
              </label>
              <div className="relative">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#134074]" strokeWidth={2} />
                <input
                  type="text"
                  value={formData.upi_id}
                  onChange={(e) => handleChange('upi_id', e.target.value.toLowerCase())}
                  placeholder="yourname@paytm"
                  disabled={isSubmitting}
                  className={`w-full pl-12 pr-4 py-3.5 bg-[#eef4ed] border-2 ${
                    errors.upi_id ? 'border-rose-500' : 'border-[#8da9c4]/40'
                  } rounded-xl text-[#0b2545] placeholder:text-[#13315c]/40 focus:outline-none focus:border-[#134074] transition-colors disabled:opacity-50`}
                />
              </div>
              {errors.upi_id && (
                <p className="text-xs text-rose-600 mt-1.5 ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" strokeWidth={2.5} />
                  {errors.upi_id}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#134074] to-[#0b2545] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-3 group mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" strokeWidth={2.5} />
                  Creating Account...
                </>
              ) : (
                <>
                  <Shield className="w-6 h-6" strokeWidth={2.5} />
                  Create GigShield Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* IRDAI Compliance */}
      <div className="px-6 mb-6">
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <div>
            <p className="text-sm text-emerald-900 font-bold mb-1">🔒 IRDAI Compliant & Secure</p>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Your data is encrypted with bank-grade security. We collect only IRDAI-mandated information for policy issuance.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="px-6 mb-6">
        <div className="bg-gradient-to-br from-[#134074]/10 to-[#8da9c4]/20 rounded-2xl p-5 border border-[#8da9c4]/50">
          <p className="font-bold text-[#0b2545] mb-4 text-base">✨ What You Get with GigShield</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#134074] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0b2545]">Instant Automatic Claims</p>
                <p className="text-xs text-[#13315c]/70">No forms, no calls - payouts in under 5 minutes</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#134074] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0b2545]">Weather-Based Protection</p>
                <p className="text-xs text-[#13315c]/70">Coverage for rain, AQI, heat waves, and storms</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#134074] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0b2545]">Affordable Weekly Premiums</p>
                <p className="text-xs text-[#13315c]/70">Plans starting at ₹30/week • Cancel anytime</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#134074] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0b2545]">30-Day Money-Back Guarantee</p>
                <p className="text-xs text-[#13315c]/70">Not satisfied? Get full refund, no questions asked</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-center gap-4 text-[#13315c]/60 text-xs">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" strokeWidth={2} />
            <span>50K+ Users</span>
          </div>
          <div className="w-1 h-1 bg-[#13315c]/40 rounded-full"></div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" strokeWidth={2} />
            <span>IRDAI Certified</span>
          </div>
          <div className="w-1 h-1 bg-[#13315c]/40 rounded-full"></div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" strokeWidth={2} />
            <span>4.8★ Rating</span>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="px-6 mb-8">
        <p className="text-xs text-[#13315c]/60 text-center leading-relaxed">
          By creating an account, you agree to our{' '}
          <span className="text-[#134074] font-bold underline">Terms of Service</span>,{' '}
          <span className="text-[#134074] font-bold underline">Privacy Policy</span>, and{' '}
          <span className="text-[#134074] font-bold underline">Insurance Terms</span>
        </p>
      </div>
    </MobileLayout>
  );
}
