import { MobileLayout } from '../components/MobileLayout';
import { User, Phone, MapPin, CreditCard, Users, HelpCircle, FileText, LogOut, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from "react";

export function Profile() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("gigshield_user") || "null");
  useEffect(()=>{
  if (!userData) {
  navigate("/login");
}
}, [userData, navigate]);

if (!userData) return null;
  // const handleSignOut = () => {
  //   // Clear all user data from localStorage
  //   localStorage.removeItem('gigshield_user');
  //   localStorage.removeItem('gigshield_policy');
    
  //   // Navigate to login page
  //   navigate('/Login');
  // };
const handleSignOut = () => {
  localStorage.removeItem("gigshield_user");
  localStorage.removeItem("gigshield_policy");

  navigate("/login");
};
  return (
    <MobileLayout>
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white px-6 pt-12 pb-8">
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        <p className="text-indigo-100 text-sm">Manage your account</p>
      </div>

      <div className="px-6 -mt-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {userData.name.split(' ').map((n: any[]) => n[0]).join('')}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{userData.name}</p>
              <p className="text-sm text-gray-600">{userData.platform_id} Partner</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Personal Information</h2>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Phone Number</p>
              <p className="font-semibold text-gray-900">{userData.phone}</p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Service Location</p>
              <p className="font-semibold text-gray-900">{userData.location}</p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">UPI ID</p>
              <p className="font-semibold text-gray-900">{userData.upi_id}</p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Nominee</p>
              <p className="font-semibold text-gray-900">{userData.nominee}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Account Actions</h2>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-blue-600" />
              </div>
              <p className="font-semibold text-gray-900">Help & Support</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <p className="font-semibold text-gray-900">Policy Documents</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <p className="font-semibold text-gray-900">Update KYC</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="px-6 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Grievance Redressal</h3>
          <p className="text-sm text-blue-800 mb-3">
            GigShield follows IRDAI 15-day SLA for all complaints. Auto-escalation triggered at day 13.
          </p>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            Raise a Complaint →
          </button>
        </div>
      </div>

      <div className="px-6 mb-6">
        <button className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-200" onClick={handleSignOut}>
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>

      <div className="px-6 mb-6">
        <div className="text-center text-xs text-gray-500">
          <p>GigShield v1.0.0</p>
          <p className="mt-1">© 2026 VisionCoders • IRDAI Compliant</p>
        </div>
      </div>
    </MobileLayout>
  );
}