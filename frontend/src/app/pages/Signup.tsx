import { MobileLayout } from '../components/MobileLayout';
import {
  Shield, User, Users, Phone, Wallet,
  ArrowRight, CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../../config';

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
    'Zomato', 'Swiggy', 'Dunzo', 'Blinkit', 'Zepto',
    'Rapido', 'Uber Eats', 'Porter', 'Other',
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.length < 3) {
      newErrors.name = 'Full name must be at least 3 characters';
    }

    if (!formData.nominee.trim() || formData.nominee.length < 3) {
      newErrors.nominee = 'Nominee name must be at least 3 characters';
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Enter valid 10-digit mobile number starting with 6-9';
    }

    if (!formData.platform_id.trim()) {
      newErrors.platform_id = 'Platform ID is required';
    }

    if (!/^[\w.-]+@[\w.-]+$/.test(formData.upi_id)) {
      newErrors.upi_id = 'Enter valid UPI ID (e.g., name@paytm)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Server returned invalid response');
      }

      if (!response.ok || !data.user) {
        throw new Error(data.message || 'Signup failed');
      }

      localStorage.setItem('gigshield_user', JSON.stringify(data.user));
      localStorage.setItem('gigshield_policy', JSON.stringify({ isActive: false }));

      setSuccess(true);

      setTimeout(() => {
        navigate('/premium');
      }, 1500);
    } catch (error: any) {
      setApiError(error.message || 'Signup failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-gradient-to-br from-[#eef4ed] to-[#8da9c4]/20 flex items-center justify-center px-4 py-4">
          <div className="bg-white rounded-2xl p-5 shadow-xl border border-[#8da9c4]/40 text-center w-full max-w-[300px]">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-lg font-bold text-[#0b2545] mb-2">Registration Successful!</h2>
            <p className="text-sm text-[#13315c] mb-3">
              Your GigKavach account has been created successfully.
            </p>
            <div className="bg-[#eef4ed] rounded-xl p-3 border border-[#8da9c4]/40">
              <p className="text-xs text-[#13315c]/70 mb-1">Welcome, {formData.name}</p>
              <p className="text-[10px] text-[#13315c]/60">Redirecting to plan selection...</p>
            </div>
            <p className="text-xs text-[#13315c]/60 mt-3">Please wait...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start px-2 py-4 font-sans">
      <div className="w-full max-w-[300px] mx-auto">
        <div className="relative bg-gradient-to-br from-[#134074] via-[#13315c] to-[#0b2545] text-white px-4 pt-8 pb-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-60 h-60 bg-[#8da9c4] rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#0b2545] rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">GigKavach</h1>
                <p className="text-[10px] text-[#8da9c4]">Income Protection for Gig Workers</p>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-1">Create Your Account</h2>
              <p className="text-xs text-[#8da9c4]">Get protected in under 3 minutes</p>
            </div>
          </div>
        </div>

        <div className="px-4 -mt-6 mb-6 relative z-20">
          <div className="bg-white rounded-2xl p-4 border border-[#8da9c4]/40 shadow-md">
            {apiError && (
              <div className="mb-4 bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <div>
                  <p className="text-xs font-semibold text-rose-900 mb-1">Registration Failed</p>
                  <p className="text-[10px] text-rose-800">{apiError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-[#0b2545] mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#134074]" strokeWidth={2} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-3 py-3 text-sm bg-[#eef4ed] border ${
                      errors.name ? 'border-rose-500' : 'border-[#8da9c4]/40'
                    } rounded-xl text-[#0b2545] placeholder:text-[#13315c]/40 focus:outline-none focus:border-[#134074] transition-colors disabled:opacity-50`}
                  />
                </div>
                {errors.name && (
                  <p className="text-[10px] text-rose-600 mt-1 ml-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" strokeWidth={2.5} />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#0b2545] mb-1">
                  Nominee Name <span className="text-rose-500">*</span>
                  <span className="ml-1 text-[9px] font-normal text-[#13315c]/60">(IRDAI)</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#134074]" strokeWidth={2} />
                  <input
                    type="text"
                    value={formData.nominee}
                    onChange={(e) => handleChange('nominee', e.target.value)}
                    placeholder="Enter nominee's full name"
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-3 py-3 text-sm bg-[#eef4ed] border ${
                      errors.nominee ? 'border-rose-500' : 'border-[#8da9c4]/40'
                    } rounded-xl text-[#0b2545] placeholder:text-[#13315c]/40 focus:outline-none focus:border-[#134074] transition-colors disabled:opacity-50`}
                  />
                </div>
                {errors.nominee && (
                  <p className="text-[10px] text-rose-600 mt-1 ml-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" strokeWidth={2.5} />
                    {errors.nominee}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#0b2545] mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#134074]" strokeWidth={2} />
                  <div className="absolute left-10 top-1/2 -translate-y-1/2 text-[#13315c] font-semibold text-xs border-r border-[#8da9c4]/40 pr-2">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    disabled={isSubmitting}
                    className={`w-full pl-[72px] pr-3 py-3 text-sm bg-[#eef4ed] border ${
                      errors.phone ? 'border-rose-500' : 'border-[#8da9c4]/40'
                    } rounded-xl text-[#0b2545] placeholder:text-[#13315c]/40 focus:outline-none focus:border-[#134074] transition-colors disabled:opacity-50`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[10px] text-rose-600 mt-1 ml-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" strokeWidth={2.5} />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#0b2545] mb-1">
                  Platform ID <span className="text-rose-500">*</span>
                  <span className="ml-1 text-[9px] font-normal text-[#13315c]/60">(e.g. Zomato)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={formData.platform_id.split('-')[0] || ''}
                    onChange={(e) => {
                      const platform = e.target.value;
                      const id = formData.platform_id.split('-')[1] || '';
                      handleChange('platform_id', platform ? `${platform}-${id}` : '');
                    }}
                    className="bg-[#eef4ed] border border-[#8da9c4]/40 rounded-xl px-2 py-3 text-xs text-[#0b2545] focus:outline-none focus:border-[#134074]"
                  >
                    <option value="">Platform</option>
                    {platforms.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={formData.platform_id.split('-')[1] || ''}
                    onChange={(e) => {
                      const platform = formData.platform_id.split('-')[0] || '';
                      handleChange('platform_id', platform ? `${platform}-${e.target.value}` : e.target.value);
                    }}
                    placeholder="Your ID"
                    disabled={isSubmitting}
                    className={`bg-[#eef4ed] border ${
                      errors.platform_id ? 'border-rose-500' : 'border-[#8da9c4]/40'
                    } rounded-xl px-2 py-3 text-xs text-[#0b2545] placeholder:text-[#13315c]/40 focus:outline-none focus:border-[#134074]`}
                  />
                </div>
                {errors.platform_id && (
                  <p className="text-[10px] text-rose-600 mt-1 ml-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" strokeWidth={2.5} />
                    {errors.platform_id}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#0b2545] mb-1">
                  UPI ID <span className="text-rose-500">*</span>
                  <span className="ml-1 text-[9px] font-normal text-[#13315c]/60">(for payouts)</span>
                </label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#134074]" strokeWidth={2} />
                  <input
                    type="text"
                    value={formData.upi_id}
                    onChange={(e) => handleChange('upi_id', e.target.value)}
                    placeholder="username@paytm"
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-3 py-3 text-sm bg-[#eef4ed] border ${
                      errors.upi_id ? 'border-rose-500' : 'border-[#8da9c4]/40'
                    } rounded-xl text-[#0b2545] placeholder:text-[#13315c]/40 focus:outline-none focus:border-[#134074] transition-colors disabled:opacity-50`}
                  />
                </div>
                {errors.upi_id && (
                  <p className="text-[10px] text-rose-600 mt-1 ml-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" strokeWidth={2.5} />
                    {errors.upi_id}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#134074] to-[#0b2545] text-white py-3 rounded-xl font-semibold text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <>
                    Create Account <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-[#8da9c4]/20 text-center">
              <p className="text-[10px] text-[#13315c]/60">
                By signing up, you agree to our{' '}
                <span className="font-semibold text-[#134074] cursor-pointer">Terms & Conditions</span>
              </p>
              <p className="text-[10px] text-[#13315c]/60 mt-2">
                Already have an account?{' '}
                <span onClick={() => navigate('/login')} className="font-semibold text-[#134074] cursor-pointer">
                  Login
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}