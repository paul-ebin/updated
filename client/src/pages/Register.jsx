import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    store_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/seller/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      navigate('/login?registered=true');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden perspective-[1000px]">
      {/* Background Lighting Effects */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-600/30 rounded-full blur-[120px]"
      />

      <motion.div 
        initial={{ opacity: 0, y: -50, rotateX: 45 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="flex justify-center mb-6">
          <motion.div 
            whileHover={{ scale: 1.1, rotateY: 180 }}
            transition={{ duration: 0.6 }}
            className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.6)] preserve-3d cursor-pointer"
          >
            <span className="text-2xl font-bold text-white tracking-wider backface-hidden">SH</span>
          </motion.div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-white tracking-tight">
          Join the platform
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            Sign in here
          </Link>
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, rotateY: -30 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 transform-style-3d"
      >
        <motion.div 
          whileHover={{ translateZ: 20, rotateX: 2, rotateY: 2, boxShadow: "0 25px 50px -12px rgba(99,102,241,0.4)" }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-slate-900/60 backdrop-blur-2xl py-8 px-4 shadow-[0_15px_35px_rgba(0,0,0,0.5)] border border-slate-700/50 sm:rounded-2xl sm:px-10 transition-all duration-300"
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                {error}
              </motion.div>
            )}
            
            <motion.div whileTap={{ scale: 0.98 }}>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="mt-1">
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 bg-slate-800/80 border border-slate-700/50 rounded-xl shadow-inner placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-md"
                  placeholder="John Doe"
                />
              </div>
            </motion.div>

            <motion.div whileTap={{ scale: 0.98 }}>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Store Name</label>
              <div className="mt-1">
                <input
                  name="store_name"
                  type="text"
                  required
                  value={formData.store_name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 bg-slate-800/80 border border-slate-700/50 rounded-xl shadow-inner placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-md"
                  placeholder="Acme Co."
                />
              </div>
            </motion.div>

            <motion.div whileTap={{ scale: 0.98 }}>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <div className="mt-1">
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 bg-slate-800/80 border border-slate-700/50 rounded-xl shadow-inner placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-md"
                  placeholder="you@example.com"
                />
              </div>
            </motion.div>

            <motion.div whileTap={{ scale: 0.98 }}>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="mt-1">
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 bg-slate-800/80 border border-slate-700/50 rounded-xl shadow-inner placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-md"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            <motion.div className="pt-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] text-sm font-bold text-white transition-all duration-300 relative overflow-hidden ${
                  loading 
                    ? 'bg-indigo-600/50 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 hover:shadow-[0_0_40px_rgba(99,102,241,0.8)]'
                } focus:outline-none`}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 -translate-x-full group-hover:animate-shine"></div>
                {loading ? 'Creating account...' : 'Create Seller Account'}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
