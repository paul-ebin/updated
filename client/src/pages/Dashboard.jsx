import { useState, useEffect } from 'react';
import { Package, ShoppingCart, DollarSign, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard', {
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });
        if (res.status === 401) {
           navigate('/login');
           return;
        }
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-red-500">Failed to load dashboard statistics.</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 flex flex-col items-center w-full relative perspective-[1000px]"
    >
      
      <div className="w-full max-w-7xl flex items-center justify-between">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your store today.</p>
        </motion.div>
      </div>

      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl transform-style-3d"
      >
        {/* Total Products */}
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20, rotateX: 20 }, show: { opacity: 1, y: 0, rotateX: 0 } }}
          whileHover={{ translateZ: 20, rotateX: 5, rotateY: 5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative group bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Package className="w-24 h-24 text-blue-600 transform group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="relative z-10 flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Total Products</p>
              <p className="text-3xl font-black text-slate-800 tracking-tight mt-1">{stats.totalProducts}</p>
            </div>
          </div>
        </motion.div>

        {/* Total Orders */}
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20, rotateX: 20 }, show: { opacity: 1, y: 0, rotateX: 0 } }}
          whileHover={{ translateZ: 20, rotateX: 5, rotateY: 5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative group bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShoppingCart className="w-24 h-24 text-emerald-600 transform group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="relative z-10 flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Total Orders</p>
              <p className="text-3xl font-black text-slate-800 tracking-tight mt-1">{stats.totalOrders}</p>
            </div>
          </div>
        </motion.div>

        {/* Total Revenue */}
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20, rotateX: 20 }, show: { opacity: 1, y: 0, rotateX: 0 } }}
          whileHover={{ translateZ: 20, rotateX: 5, rotateY: 5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative group bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-24 h-24 text-violet-600 transform group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="relative z-10 flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-xl shadow-[0_0_15px_rgba(167,139,250,0.5)]">
              <DollarSign className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Total Revenue</p>
              <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 tracking-tight mt-1">
                {formatPrice(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Low Stock Alerts */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        whileHover={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)" }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 w-full max-w-7xl overflow-hidden mt-4 relative"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500"></div>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
              className="p-2 bg-amber-100 text-amber-600 rounded-lg"
            >
              <AlertTriangle className="w-5 h-5" />
            </motion.div>
            <h2 className="text-xl font-bold text-slate-800">Low Stock Alerts</h2>
          </div>
          <motion.span 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-xs font-semibold bg-rose-100 text-rose-600 px-3 py-1 rounded-full"
          >
            {stats.lowStockItems.length} items need attention
          </motion.span>
        </div>
        <div className="p-0">
          {stats.lowStockItems.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                <Package className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">All products are adequately stocked.</p>
            </div>
          ) : (
             <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Product ID</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Name</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Remaining Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.lowStockItems.map((item, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + (index * 0.1) }}
                    key={item.id} 
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4 text-slate-400 font-medium">#{item.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-700 group-hover:text-amber-600 transition-colors">{item.name}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-rose-100 to-rose-50 text-rose-700 border border-rose-200 shadow-sm animate-pulse">
                        Only {item.quantity} left
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
