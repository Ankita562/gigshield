import { Home, TrendingUp, Wallet, FileText, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/forecast', icon: TrendingUp, label: 'Forecast' },
    { path: '/payouts', icon: Wallet, label: 'Payouts' },
    { path: '/policy', icon: FileText, label: 'Policy' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      
      <div
        className="w-full max-w-md mx-auto bg-white shadow-2xl relative "
        style={{ height: '100vh', maxHeight: '844px' }}
      >
        {/* Main Content */}
        <main className="h-full pb-28 overflow-y-auto">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-gray-200 z-50 shadow-lg">
          <div className="grid grid-cols-5 h-20 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative flex flex-col items-center justify-center gap-1 group"
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                  )}

                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 scale-105'
                        : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? 'text-white' : 'text-gray-600'
                      }`}
                      strokeWidth={2.5}
                    />
                  </div>

                  <span
                    className={`text-xs font-medium ${
                      isActive ? 'text-indigo-600' : 'text-gray-500'
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