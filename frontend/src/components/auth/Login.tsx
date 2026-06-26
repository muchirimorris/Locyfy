import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import apiClient from '../../services/apiClient';
import { useAuthStore } from '../../store/authStore';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/token/', {
        username: email, // SimpleJWT uses username by default
        password,
      });
      
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Update Axios defaults
      apiClient.defaults.headers['Authorization'] = `Bearer ${access}`;
      
      // Fetch user profile to get the real role
      const meResponse = await apiClient.get('/me/');
      const isVendorUser = meResponse.data.role === 'vendor';
      
      // Update global state
      login(access, isVendorUser);
      
      if (isVendorUser) {
        navigate('/vendor-dashboard');
      } else {
        navigate('/');
      }
    } catch (err: unknown) {
      console.error('Login error', err);
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 14 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Left Image Panel */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-gray-900/90 z-10 mix-blend-multiply" />
        
        {/* Floating Idle Orbs */}
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/40 rounded-full blur-[100px] z-10 mix-blend-screen"
        />
        <motion.div 
          animate={{ x: [0, -80, 0], y: [0, 80, 0], scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-400/30 rounded-full blur-[100px] z-10 mix-blend-screen"
        />

        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: [1.1, 1.2, 1.1], x: [0, -20, 0], y: [0, -10, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=2000" 
          alt="Premium Venue" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="relative z-20 flex flex-col justify-end p-16 h-full text-white">
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-20 h-2 bg-emerald-500 mb-8 rounded-full origin-left"
          />
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-5xl font-black mb-6 leading-tight drop-shadow-lg"
          >
            Your Premium <br /> Spaces Await.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-xl text-gray-200 font-medium max-w-lg drop-shadow-md"
          >
            Join thousands of event organizers finding the perfect, verified venues seamlessly.
          </motion.p>
        </div>
      </motion.div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-20 bg-white relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-8 left-8 hidden lg:flex items-center gap-4"
        >
           <Link to="/" className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-gray-100 transition-colors">
             <ArrowLeft className="w-5 h-5 text-gray-600" />
           </Link>
           <Link to="/" className="text-2xl font-black text-gray-900 tracking-tight">Locyfy<span className="text-emerald-500">.</span></Link>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full max-w-md"
        >
          <motion.div variants={itemVariants} className="text-left mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 font-medium text-lg">Log in to your Locyfy account.</p>
          </motion.div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 text-sm font-bold flex items-center gap-2 border border-red-100"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 block"></span>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-black text-gray-900 mb-3 tracking-wide">EMAIL ADDRESS</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-semibold text-gray-900 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-black text-gray-900 tracking-wide">PASSWORD</label>
                <a href="#" className="text-xs font-bold text-emerald-600 hover:text-emerald-500 transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-semibold text-gray-900 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading}
                className="w-full py-4 mt-4 bg-gray-900 text-white font-black text-lg tracking-wide rounded-2xl hover:bg-emerald-500 transition-colors shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
              </motion.button>
            </motion.div>
          </form>

          <motion.p variants={itemVariants} className="text-center text-sm font-semibold text-gray-500 mt-10">
            Don't have an account? <Link to="/register" className="text-emerald-600 font-bold hover:text-emerald-500 ml-1">Sign up</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};
