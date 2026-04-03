import { MobileLayout } from '../components/MobileLayout';
import { Phone, MapPin, CreditCard, Users, HelpCircle, FileText, LogOut, ChevronRight, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from "react";

export function Profile() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("gigshield_user") || "null");

  useEffect(() => {
    if (!userData) {
      navigate("/login");
    }
  }, [userData, navigate]);

  if (!userData) return null;

  const handleSignOut = () => {
    localStorage.removeItem("gigshield_user");
    localStorage.removeItem("gigshield_policy");
    navigate("/login");
  };

  return (
    <MobileLayout>
      <div className="bg-gradient-to-br from-[#134074] via-[#13315c] to-[#0b2545] text-white px-6 pt-12 pb-8">
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        <p className="text-[#8da9c4] text-sm">Manage your account</p>
      </div>

      <div className="px-6 -mt-6 mb-6">
        <div className="bg-[#eef4ed] rounded-xl shadow-lg p-5 border border-[#8da9c4]/30">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#134074] to-[#13315c] rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {userData.name ? userData.name.charAt(0) : 'U'}
            </div>
            <div>
              <p className="font-bold text-[#0b2545] text-lg">{userData.name}</p>
              <p className="text-sm text-[#13315c]">{userData.platform_id} Partner</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mb-6">
        <h2 className="font-semibold text-[#0b2545] mb-3">Personal Information</h2>
        <div className="bg-[#eef4ed] rounded-xl border border-[#8da9c4]/40 divide-y divide-[#8da9c4]/20">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#8da9c4]/30 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-[#134074]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#13315c]/70">Phone Number</p>
              <p className="font-semibold text-[#0b2545]">{userData.phone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mb-6">
        <h2 className="font-semibold text-[#0b2545] mb-3">Account Actions</h2>
        <div className="bg-[#eef4ed] rounded-xl border border-[#8da9c4]/40 divide-y divide-[#8da9c4]/20 overflow-hidden">
          <Link to="/help" className="w-full p-4 flex items-center justify-between hover:bg-[#8da9c4]/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#8da9c4]/30 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-[#134074]" />
              </div>
              <p className="font-semibold text-[#0b2545]">Help & Support</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#8da9c4]" />
          </Link>
        </div>
      </div>

      <div className="px-6 mb-10 text-center">
        <button
          onClick={handleSignOut}
          className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-semibold border border-red-200 flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </MobileLayout>
  );
}