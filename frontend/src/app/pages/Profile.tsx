import { MobileLayout } from '../components/MobileLayout';
import { User, Phone, MapPin, CreditCard, Users, HelpCircle, FileText, LogOut, ChevronRight } from 'lucide-react';

export function Profile() {
  const userData = {
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    location: 'Bengaluru, PIN 560034',
    upiId: 'rajesh.kumar@paytm',
    platform: 'Zomato',
    nominee: 'Priya Kumar (Wife)',
    joinDate: 'Feb 15, 2026',
  };

  return (
    <MobileLayout>
      {/* HEADER */}
      <div className="relative bg-gradient-to-br from-[#134074] via-[#13315c] to-[#0b2545] text-white px-6 pt-12 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8da9c4] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0b2545] rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-1">Profile</h1>
          <p className="text-[#8da9c4] text-sm">Manage your account</p>
        </div>
      </div>

      {/* USER CARD */}
      <div className="px-6 -mt-16 mb-6 relative z-20">
        <div className="bg-[#eef4ed] rounded-2xl shadow-2xl p-6 border border-[#8da9c4]/30">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#134074] to-[#13315c] rounded-full flex items-center justify-center text-white text-xl font-bold">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="font-bold text-[#0b2545] text-lg">{userData.name}</p>
              <p className="text-sm text-[#13315c]">{userData.platform} Partner</p>
              <p className="text-xs text-[#13315c]/70 mt-1">
                Member since {userData.joinDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PERSONAL INFO */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-bold text-[#0b2545] mb-3">
          Personal Information
        </h2>

        <div className="bg-[#eef4ed] rounded-2xl border border-[#8da9c4]/40 divide-y divide-[#8da9c4]/30">
          
          {[
            { icon: Phone, label: 'Phone Number', value: userData.phone },
            { icon: MapPin, label: 'Service Location', value: userData.location },
            { icon: CreditCard, label: 'UPI ID', value: userData.upiId },
            { icon: Users, label: 'Nominee', value: userData.nominee },
          ].map((item, i) => (
            <div key={i} className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#8da9c4]/40 rounded-xl flex items-center justify-center">
                <item.icon className="w-5 h-5 text-[#134074]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[#13315c]/70">{item.label}</p>
                <p className="font-semibold text-[#0b2545]">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACCOUNT ACTIONS */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-bold text-[#0b2545] mb-3">
          Account Actions
        </h2>

        <div className="bg-[#eef4ed] rounded-2xl border border-[#8da9c4]/40 divide-y divide-[#8da9c4]/30">
          
          {[
            { icon: HelpCircle, label: 'Help & Support' },
            { icon: FileText, label: 'Policy Documents' },
            { icon: User, label: 'Update KYC' },
          ].map((item, i) => (
            <button
              key={i}
              className="w-full p-4 flex items-center justify-between hover:bg-[#8da9c4]/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#8da9c4]/40 rounded-xl flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-[#134074]" />
                </div>
                <p className="font-semibold text-[#0b2545]">{item.label}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#13315c]/60" />
            </button>
          ))}
        </div>
      </div>

      {/* GRIEVANCE */}
      <div className="px-6 mb-6">
        <div className="bg-[#8da9c4]/20 rounded-2xl p-5 border border-[#8da9c4]/50">
          <h3 className="font-bold text-[#0b2545] mb-2">
            Grievance Redressal
          </h3>
          <p className="text-sm text-[#13315c] mb-3">
            GigShield follows IRDAI 15-day SLA for all complaints. Auto-escalation triggered at day 13.
          </p>
          <button className="text-sm font-semibold text-[#134074] hover:underline">
            Raise a Complaint →
          </button>
        </div>
      </div>

      {/* SIGN OUT */}
      <div className="px-6 mb-6">
        <button className="w-full bg-[#eef4ed] text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition-all flex items-center justify-center gap-2 border border-red-200">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>

      {/* FOOTER */}
      <div className="px-6 mb-6">
        <div className="text-center text-xs text-[#13315c]/60">
          <p>GigShield v1.0.0</p>
          <p className="mt-1">© 2026 VisionCoders • IRDAI Compliant</p>
        </div>
      </div>
    </MobileLayout>
  );
}
