import { Home as HomeIcon, TrendingUp, Wallet, FileText, User, ClipboardList } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: HomeIcon, label: 'Home' },
    { path: '/forecast', icon: TrendingUp, label: 'Forecast' },
    { path: '/payouts', icon: Wallet, label: 'Payouts' },
    { path: '/claims', icon: ClipboardList, label: 'Claims' },
    { path: '/policy', icon: FileText, label: 'Policy' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-[#e5e7eb] flex items-center justify-center p-4">
      
      {/* 📱 COMPACT CONTAINER (GigKavach Edition) */}
      <div className="relative flex flex-col overflow-hidden bg-white w-[300px] h-[520px] rounded-[24px] shadow-2xl border-[6px] border-[#13315C]/5">
        
        {/* 📜 CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] scrollbar-hide pb-20">
          <div style={{ zoom: '0.60', transformOrigin: 'top center' }}>
            {children}
          </div>
        </main>

        {/* 🔻 PREMIUM BOTTOM NAV */}
        <nav className="absolute bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-100 px-1 pt-2 pb-3 z-50">
          <div className="grid grid-cols-6 items-center h-10">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center justify-center transition-all active:scale-90"
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-[#13315C] text-white shadow-lg'
                        : 'text-slate-400'
                    }`}
                  >
                    <Icon size={14} strokeWidth={isActive ? 3 : 2} />
                  </div>

                  <span
                    className={`text-[7px] mt-1 font-black uppercase tracking-tighter ${
                      isActive ? 'text-[#13315C]' : 'text-slate-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}