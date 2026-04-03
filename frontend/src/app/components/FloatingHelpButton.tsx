import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FloatingHelpButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/help')}
      // Change 'fixed' to 'absolute'
      // Use 'right-4' instead of 'right-6' to keep it away from the edge
      className="absolute bottom-24 right-4 w-14 h-14 bg-[#4f46e5] text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition-transform active:scale-95"
    >
      <MessageCircle className="w-7 h-7" />
    </button>
  );
}