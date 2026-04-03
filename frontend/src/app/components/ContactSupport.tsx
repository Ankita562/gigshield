import { Mail, Phone, MessageCircle, Clock, MapPin } from 'lucide-react';

export function ContactSupport() {
  const handleEmailClick = () => {
    window.location.href = 'mailto:support@gigshield.in?subject=GigShield Support Request';
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+918008001800';
  };

  return (
    <div className="px-4 py-6 space-y-6 pb-24">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-[#134074] rounded-full flex items-center justify-center mx-auto">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-[#134074]">Need More Help?</h2>
        <p className="text-sm text-[#13315c]">
          Our support team is here to assist you with complex queries
        </p>
      </div>

      {/* Contact Options */}
      <div className="space-y-3">
        {/* Email Support */}
        <button
          onClick={handleEmailClick}
          className="w-full bg-white border-2 border-[#134074] rounded-xl p-4 hover:bg-[#eef4ed] transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#134074] rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-[#134074]">Email Support</div>
              <div className="text-sm text-[#13315c]">support@gigshield.in</div>
              <div className="text-xs text-[#8da9c4] mt-1">Response within 24 hours</div>
            </div>
          </div>
        </button>

        {/* Phone Support */}
        <button
          onClick={handlePhoneClick}
          className="w-full bg-white border-2 border-[#134074] rounded-xl p-4 hover:bg-[#eef4ed] transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#134074] rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-[#134074]">Phone Support</div>
              <div className="text-sm text-[#13315c]">+91 800-800-1800</div>
              <div className="text-xs text-[#8da9c4] mt-1">Mon-Sat, 9 AM - 6 PM IST</div>
            </div>
          </div>
        </button>
      </div>

      {/* Office Hours Info */}
      <div className="bg-[#eef4ed] rounded-xl p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-[#134074] mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium text-[#134074] text-sm">Support Hours</div>
            <div className="text-sm text-[#13315c] mt-1">
              Monday - Saturday: 9:00 AM - 6:00 PM IST<br />
              Sunday: Closed
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-[#134074] mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium text-[#134074] text-sm">Registered Office</div>
            <div className="text-sm text-[#13315c] mt-1">
              GigShield Insurance Services Pvt. Ltd.<br />
              123 Business Park, Electronic City<br />
              Bangalore - 560100, India
            </div>
          </div>
        </div>
      </div>

      {/* IRDAI Info */}
      <div className="bg-white border border-[#8da9c4] rounded-xl p-4">
        <div className="text-sm text-[#13315c] space-y-2">
          <p className="font-medium text-[#134074]">Regulatory Information</p>
          <p>
            <span className="font-medium">IRDAI Registration:</span> IRDAI/DB/000/25
          </p>
          <p>
            <span className="font-medium">Valid till:</span> 31-03-2028
          </p>
          <p className="text-xs mt-3 text-[#8da9c4]">
            Insurance is the subject matter of solicitation. Please read the policy document carefully.
          </p>
        </div>
      </div>
    </div>
  );
}