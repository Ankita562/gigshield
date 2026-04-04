import { useState } from 'react';
import { MessageCircle, HeadphonesIcon, ArrowLeft, ChevronRight, FileText, Wallet, Shield, Users, AlertCircle, CloudRain, UserPlus, CheckCircle } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { HelpChatbot } from '../components/HelpChatbot';
import { ContactSupport } from '../components/ContactSupport';



// Category icons mapping
const categoryIcons: { [key: string]: any } = {
  'Policy Coverage': Shield,
  'Claims': FileText,
  'Premium & Plans': Wallet,
  'Payouts': CheckCircle,
  'Policy Management': Users,
  'Regulations': AlertCircle,
  'Registration': UserPlus,
  'Weather Verification': CloudRain,
};

export function Help() {
  const [activeTab, setActiveTab] = useState<'chat' | 'contact'>('chat');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = [
    'Policy Coverage',
    'Claims',
    'Premium & Plans',
    'Payouts',
    'Policy Management',
    'Regulations',
    'Registration',
    'Weather Verification',
  ];

  const handleBackToTopics = () => {
    setSelectedCategory(null);
  };

  return (
    <MobileLayout>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#134074] via-[#13315c] to-[#0b2545] text-white px-6 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-2">
          {selectedCategory && activeTab === 'chat' && (
            <button
              onClick={handleBackToTopics}
              className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 hover:bg-white/25 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold">
              {selectedCategory && activeTab === 'chat' ? selectedCategory : 'Help & Support'}
            </h1>
            <p className="text-[#8da9c4] text-sm">
              {selectedCategory && activeTab === 'chat' ? 'Select a question below' : 'We\'re here to assist you'}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Only show when no category is selected */}
      {!selectedCategory && (
        <div className="bg-white border-b border-[#8da9c4] flex sticky top-0 z-10 shadow-sm">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'chat'
                ? 'text-[#134074] border-b-2 border-[#134074]'
                : 'text-[#8da9c4]'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span>Chat Assistant</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'contact'
                ? 'text-[#134074] border-b-2 border-[#134074]'
                : 'text-[#8da9c4]'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <HeadphonesIcon className="w-4 h-4" />
              <span>Contact Us</span>
            </div>
          </button>
        </div>
      )}

      {/* Content Area */}
      <div className="flex flex-col pb-20" style={{ minHeight: 'calc(100vh - 200px)' }}>
        {activeTab === 'chat' ? (
          !selectedCategory ? (
            // Topic Selection View
            <div className="flex-1 overflow-y-auto px-5 py-6 pb-24">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-[#0b2545] mb-2">Choose a Topic</h2>
                <p className="text-sm text-[#8da9c4]">Select a category to see relevant questions</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {categories.map((category) => {
                  const Icon = categoryIcons[category] || MessageCircle;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="w-full text-left px-5 py-5 bg-gradient-to-r from-[#eef4ed] to-white border border-[#8da9c4]/40 rounded-2xl text-[#134074] hover:border-[#134074] hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#134074] to-[#13315c] rounded-xl flex items-center justify-center shadow-md">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-base mb-1">{category}</div>
                            <div className="text-xs text-[#8da9c4]">Tap to view questions</div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#8da9c4] group-hover:text-[#134074] group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            // Chatbot View with selected category
            <div className="flex-1 overflow-hidden">
              <HelpChatbot selectedCategory={selectedCategory} />
            </div>
          )
        ) : (
          <div className="pb-24 overflow-y-auto">
            <ContactSupport />
          </div>
        )}
      </div>

      {/* Footer Note - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#8da9c4] px-4 py-3 z-10 max-w-md mx-auto">
        <p className="text-xs text-center text-[#8da9c4]">
          GigKavach is regulated by IRDAI | CIN: U66000KA2025PTC123456
        </p>
      </div>
    </MobileLayout>
  );
}