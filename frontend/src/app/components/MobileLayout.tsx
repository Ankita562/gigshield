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
    // On mobile: full screen. On desktop (md+): centered mockup with grey bg
    <div className="min-h-screen bg-white md:bg-[#e5e7eb] md:flex md:items-center md:justify-center md:p-4">

      {/* On mobile: fills screen. On desktop: phone-frame mockup */}
      <div className="
        relative flex flex-col overflow-hidden bg-white
        w-full min-h-screen
        md:w-[390px] md:min-h-0 md:h-[780px] md:rounded-[40px] md:shadow-2xl md:border-[6px] md:border-[#13315C]/10
      ">

        {/* Content area — no zoom hack, natural sizing */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] scrollbar-hide pb-20">
          {children}
        </main>

        {/* Bottom nav */}
        <nav className="absolute bottom-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-100 px-2 pt-2 pb-safe z-50"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
          <div className="grid grid-cols-6 items-center h-12">
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
                    className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-[#13315C] text-white shadow-lg'
                        : 'text-slate-400'
                    }`}
                  >
                    <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span
                    className={`text-[9px] mt-0.5 font-bold uppercase tracking-tight ${
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