import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('Registration successful! Please sign in.');
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/seller/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden perspective-[1000px]">
      {/* Background Lighting Effects */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/40 rounded-full blur-[100px]"
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/40 rounded-full blur-[100px]"
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
            className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.6)] preserve-3d cursor-pointer"
          >
            <span className="text-2xl font-bold text-white tracking-wider backface-hidden">SH</span>
          </motion.div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-white tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Sign in to your seller portal or{' '}
          <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
            create a new account
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
          whileHover={{ translateZ: 20, rotateX: 2, rotateY: 2, boxShadow: "0 25px 50px -12px rgba(59,130,246,0.4)" }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-slate-900/60 backdrop-blur-2xl py-8 px-4 shadow-[0_15px_35px_rgba(0,0,0,0.5)] border border-slate-700/50 sm:rounded-2xl sm:px-10 transition-all duration-300"
        >
          
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-xl text-sm flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              {success}
            </motion.div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                {error}
              </motion.div>
            )}

            <motion.div whileTap={{ scale: 0.98 }}>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <div className="mt-1">
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 bg-slate-800/80 border border-slate-700/50 rounded-xl shadow-inner placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-md"
                  placeholder="seller@example.com"
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
                  className="appearance-none block w-full px-4 py-3 bg-slate-800/80 border border-slate-700/50 rounded-xl shadow-inner placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-md"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            <motion.div className="pt-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] text-sm font-bold text-white transition-all duration-300 relative overflow-hidden ${
                  loading 
                    ? 'bg-blue-600/50 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.8)]'
                }`}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 -translate-x-full group-hover:animate-shine"></div>
                {loading ? 'Authenticating...' : 'Sign in to Dashboard'}
              </button>
            </motion.div>
          </form>
        </motion.div>
        
        {/* Decorative elements */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 1 }}
          className="mt-10 flex justify-center space-x-4"
        >
           <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full bg-slate-400 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></motion.div>
           <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, delay: 0.2, repeat: Infinity }} className="w-2 h-2 rounded-full bg-slate-500 shadow-[0_0_10px_rgba(255,255,255,0.4)]"></motion.div>
           <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, delay: 0.4, repeat: Infinity }} className="w-2 h-2 rounded-full bg-slate-600 shadow-[0_0_10px_rgba(255,255,255,0.3)]"></motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
