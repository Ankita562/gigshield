import { useState } from 'react';
import { Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface HelpChatbotProps {
  selectedCategory: string;
}

const IRDAI_FAQS: FAQ[] = [
  {
    id: '1',
    question: 'What is covered under GigShield policy?',
    answer: 'GigShield provides income protection coverage for food delivery partners. Coverage includes: Loss of income due to adverse weather conditions (heavy rain, storms, extreme heat), poor air quality (AQI above 300), and accidental injury during delivery. Claims are processed automatically based on verified conditions.',
    category: 'Policy Coverage'
  },
  {
    id: '2',
    question: 'How do I file a claim?',
    answer: 'GigShield uses automatic claim processing. When adverse conditions are detected (weather/AQI) during your active delivery hours, claims are automatically generated and processed. For injury claims, you need to submit medical documentation through the app within 24 hours of the incident.',
    category: 'Claims'
  },
  {
    id: '3',
    question: 'What are the premium payment options?',
    answer: 'We offer three weekly premium plans: Basic (₹30/week) - ₹200/day payout, Standard (₹45/week) - ₹350/day payout, Premium (₹70/week) - ₹500/day payout. Payments are auto-debited weekly from your linked UPI account.',
    category: 'Premium & Plans'
  },
  {
    id: '4',
    question: 'How long does it take to receive payouts?',
    answer: 'Automatic payouts for weather/AQI-related claims are processed within 24-48 hours and credited directly to your registered UPI account. Injury claims may take 3-5 business days after document verification.',
    category: 'Payouts'
  },
  {
    id: '5',
    question: 'Can I cancel my policy?',
    answer: 'Yes, you can cancel your policy anytime. As per IRDAI guidelines, if you cancel within 15 days of purchase (free-look period), you will receive a full refund minus proportionate risk premium. After 15 days, cancellation will be processed with pro-rata premium refund.',
    category: 'Policy Management'
  },
  {
    id: '6',
    question: 'Who regulates GigShield?',
    answer: 'GigShield is regulated by the Insurance Regulatory and Development Authority of India (IRDAI). We comply with all IRDAI guidelines for insurance products. Our IRDAI registration number and compliance details are available in the Policy section.',
    category: 'Regulations'
  },
  {
    id: '7',
    question: 'What documents do I need to register?',
    answer: 'For registration, you need: Valid mobile number, Platform ID (Zomato/Swiggy/Others), UPI ID for payouts, and Nominee details. KYC documents (Aadhaar/PAN) will be collected during policy activation.',
    category: 'Registration'
  },
  {
    id: '8',
    question: 'How is weather condition verified?',
    answer: 'We use real-time data from India Meteorological Department (IMD) and verified weather APIs. Weather conditions are matched with your location and active delivery hours. All verification data is transparently shown in the Forecast section.',
    category: 'Weather Verification'
  },
  {
    id: '9',
    question: 'What happens if I miss a premium payment?',
    answer: 'If a premium payment fails, you have a 7-day grace period to update your payment method. During the grace period, your coverage continues. If payment is not received after 7 days, the policy will lapse and coverage will stop.',
    category: 'Premium & Plans'
  },
  {
    id: '10',
    question: 'Can I change my plan?',
    answer: 'Yes, you can upgrade or downgrade your plan anytime. Plan changes take effect from the next billing cycle. Premium difference will be adjusted in your next payment.',
    category: 'Policy Management'
  }
];

export function HelpChatbot({ selectedCategory }: HelpChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: `Hi! I can answer questions about ${selectedCategory}. Select a question below to get started.`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [showQuestions, setShowQuestions] = useState(true);

  // Filter FAQs by selected category
  const filteredFAQs = IRDAI_FAQS.filter(faq => faq.category === selectedCategory);

  const handleSelectQuestion = (faq: FAQ) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: faq.question,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setShowQuestions(false);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: faq.answer,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      setTimeout(() => {
        const followUpText = filteredFAQs.length === 1 
          ? 'Use the back button to choose a different topic.'
          : 'Have another question from this topic? Use the back button to choose a different topic.';
        
        const followUpMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: followUpText,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, followUpMessage]);
        setShowQuestions(true);
      }, 800);
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-[#eef4ed]/30">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                message.sender === 'user'
                  ? 'bg-gradient-to-br from-[#8da9c4] to-[#134074]'
                  : 'bg-gradient-to-br from-[#134074] to-[#0b2545]'
              }`}
            >
              {message.sender === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
            <div
              className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${
                message.sender === 'user'
                  ? 'bg-gradient-to-br from-[#134074] to-[#13315c] text-white'
                  : 'bg-white text-[#0b2545] border border-[#8da9c4]/30'
              }`}
            >
              <p className="text-[15px] leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Question Selection Area */}
      {showQuestions && (
        <div className="border-t border-[#8da9c4]/30 bg-white px-5 py-4 max-h-[50vh] overflow-y-auto shadow-inner">
          <div className="mb-4">
            <h3 className="text-sm text-[#13315c] font-bold mb-1">
              Questions about {selectedCategory}:
            </h3>
            <p className="text-xs text-[#8da9c4]">
              {filteredFAQs.length} {filteredFAQs.length === 1 ? 'question' : 'questions'} available
            </p>
          </div>
          
          <div className="space-y-2.5">
            {filteredFAQs.map((faq) => (
              <button
                key={faq.id}
                onClick={() => handleSelectQuestion(faq)}
                className="w-full text-left px-5 py-4 bg-gradient-to-r from-[#eef4ed] to-white border border-[#8da9c4]/40 rounded-xl text-[#134074] hover:border-[#134074] hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-[#8da9c4] text-lg flex-shrink-0">•</span>
                  <div className="flex-1">
                    <div className="font-medium text-[15px] leading-relaxed">{faq.question}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}