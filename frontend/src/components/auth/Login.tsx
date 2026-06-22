import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2 } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-gray-900/80 z-10 mix-blend-multiply" />
        <img 
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=2000" 
          alt="Premium Venue" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="relative z-20 flex flex-col justify-end p-16 h-full text-white">
          <div className="w-20 h-2 bg-emerald-500 mb-8 rounded-full"></div>
          <h2 className="text-5xl font-black mb-6 leading-tight drop-shadow-lg">
            Your Premium <br /> Spaces Await.
          </h2>
          <p className="text-xl text-gray-200 font-medium max-w-lg drop-shadow-md">
            Join thousands of event organizers finding the perfect, verified venues seamlessly.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-20 bg-white relative">
        <div className="absolute top-8 left-8 hidden lg:block">
           <Link to="/" className="text-2xl font-black text-gray-900 tracking-tight">Locyfy<span className="text-emerald-500">.</span></Link>
        </div>

        <div className="w-full max-w-md animate-fade-in-up">
          <div className="text-left mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 font-medium text-lg">Log in to your Locyfy account.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 text-sm font-bold flex items-center gap-2 border border-red-100">
              <span className="w-2 h-2 rounded-full bg-red-500 block"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
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
            </div>

            <div>
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
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 mt-4 bg-gray-900 text-white font-black text-lg tracking-wide rounded-2xl hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
            </button>
          </form>

          <p className="text-center text-sm font-semibold text-gray-500 mt-10">
            Don't have an account? <Link to="/register" className="text-emerald-600 font-bold hover:text-emerald-500 ml-1">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
