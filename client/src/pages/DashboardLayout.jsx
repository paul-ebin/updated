import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

import { useCurrency } from '../context/CurrencyContext';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const { currency, setCurrency, currencies } = useCurrency();

  const handleLogout = async () => {
    fetch('/api/seller/logout', { method: 'POST' }).finally(() => {
      navigate('/login');
    });
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
    { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  ];

  return (
    <div className="flex h-screen bg-slate-50 relative overflow-hidden">
      
      {/* Background Lighting Effects for Dashboard */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 text-white transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0 shadow-[4px_0_24px_rgba(0,0,0,0.5)]' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800/50 bg-slate-900/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
               <span className="text-xl font-bold tracking-wider text-white">SH</span>
             </div>
             <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Seller Hub</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto h-[calc(100%-5rem)] pb-24 custom-scrollbar">
          <nav className="px-4 pt-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}`));
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                    isActive 
                      ? 'bg-blue-600/10 text-blue-400 font-medium' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                  )}
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800/50 bg-slate-900/80 backdrop-blur-md">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3.5 w-full text-left text-slate-400 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all group border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Top Header */}
        <header className="bg-white/70 backdrop-blur-lg border-b border-slate-200 shadow-sm h-20 flex items-center px-4 lg:px-8 shrink-0 sticky top-0 z-30">
          <button 
            className="lg:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" 
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="ml-auto flex items-center gap-4">
             {/* Currency Selector */}
             <div className="flex items-center bg-slate-100 rounded-xl px-3 py-1.5 border border-slate-200">
                <span className="text-xs font-bold text-slate-400 mr-2">CURRENCY</span>
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
                >
                  {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             </div>

             <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-sm font-semibold text-slate-900">Welcome back</span>
                <span className="text-xs text-slate-500">Seller Dashboard</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-purple-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200 shadow-sm relative cursor-pointer hover:shadow-md transition-shadow">
               S
               <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
             </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-4 lg:p-8">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
