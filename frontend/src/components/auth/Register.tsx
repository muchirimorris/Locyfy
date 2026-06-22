import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Building, FileCheck, Loader2 } from 'lucide-react';
import apiClient from '../../services/apiClient';

import { useAuthStore } from '../../store/authStore';

export const Register: React.FC = () => {
  const [role, setRole] = useState<'user' | 'vendor'>('user');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    kraPin: '',
    businessReg: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiClient.post('/signup/', {
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: role
        // For vendor KYC, we would also post kraPin and businessReg here
      });

      // Automatically log them in
      const loginResponse = await apiClient.post('/token/', {
        username: formData.email,
        password: formData.password,
      });

      localStorage.setItem('access_token', loginResponse.data.access);
      localStorage.setItem('refresh_token', loginResponse.data.refresh);
      apiClient.defaults.headers['Authorization'] = `Bearer ${loginResponse.data.access}`;

      login(loginResponse.data.access, role === 'vendor');

      if (role === 'vendor') {
          navigate('/vendor-dashboard');
      } else {
          navigate('/');
      }
    } catch (err: unknown) {
      console.error('Registration error', err);
      setError((err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white relative overflow-y-auto">
        <div className="absolute top-8 left-8 hidden lg:block">
           <Link to="/" className="text-2xl font-black text-gray-900 tracking-tight">Locyfy<span className="text-emerald-500">.</span></Link>
        </div>

        <div className="w-full max-w-md animate-fade-in-up my-auto">
          <div className="text-left mb-8 mt-12 lg:mt-0">
            <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Create Account</h1>
            <p className="text-gray-500 font-medium text-lg">Join Locyfy today to manage your premium events.</p>
          </div>

          {/* Role Selection */}
          <div className="flex p-1.5 bg-gray-100 rounded-2xl mb-8">
            <button 
              className={`flex-1 py-3 text-sm font-black tracking-wide rounded-xl transition-all duration-300 ${role === 'user' ? 'bg-white text-gray-900 shadow-md transform scale-[1.02]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setRole('user')}
            >
              CUSTOMER
            </button>
            <button 
              className={`flex-1 py-3 text-sm font-black tracking-wide rounded-xl transition-all duration-300 ${role === 'vendor' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 transform scale-[1.02]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setRole('vendor')}
            >
              VENDOR
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 text-sm font-bold flex items-center gap-2 border border-red-100">
              <span className="w-2 h-2 rounded-full bg-red-500 block"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black text-gray-900 mb-2 tracking-widest">FIRST NAME</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="text" required
                    value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-semibold text-gray-900 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-900 mb-2 tracking-widest">LAST NAME</label>
                <input 
                  type="text" required
                  value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-semibold text-gray-900 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-900 mb-2 tracking-widest">EMAIL ADDRESS</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="email" required placeholder="you@example.com"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-semibold text-gray-900 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-900 mb-2 tracking-widest">PASSWORD</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="password" required placeholder="••••••••" minLength={8}
                  value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-semibold text-gray-900 transition-all"
                />
              </div>
            </div>

            {/* Vendor Specific KYC Fields */}
            {role === 'vendor' && (
              <div className="animate-fade-in-up space-y-5 border-t border-gray-100 pt-6 mt-6">
                <div>
                  <label className="block text-xs font-black text-emerald-800 mb-2 tracking-widest">KRA PIN NUMBER</label>
                  <div className="relative group">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400 group-focus-within:text-emerald-600 transition-colors" />
                    <input 
                      type="text" required placeholder="P000000000A"
                      value={formData.kraPin} onChange={(e) => setFormData({...formData, kraPin: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 bg-emerald-50/50 border border-emerald-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold text-gray-900 uppercase transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-emerald-800 mb-2 tracking-widest">BUSINESS REG CERTIFICATE</label>
                  <div className="relative border-2 border-dashed border-emerald-200 rounded-2xl p-6 text-center hover:bg-emerald-50 cursor-pointer transition-colors group">
                    <FileCheck className="w-10 h-10 text-emerald-400 mx-auto mb-3 group-hover:text-emerald-500 transition-colors" />
                    <p className="text-sm font-black text-emerald-800">CLICK TO UPLOAD PDF</p>
                    <p className="text-xs text-gray-500 font-semibold mt-1">Required for Locyfy Verification badge</p>
                  </div>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 mt-6 bg-gray-900 text-white font-black text-lg tracking-wide rounded-2xl hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm font-semibold text-gray-500 mt-10">
            Already have an account? <Link to="/login" className="text-emerald-600 font-bold hover:text-emerald-500 ml-1 transition-colors">Log in</Link>
          </p>
        </div>
      </div>

      {/* Right Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500/20 to-gray-900/80 z-10 mix-blend-multiply" />
        <img 
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2000" 
          alt="Premium Venue" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="relative z-20 flex flex-col justify-end p-16 h-full text-white">
          <div className="w-20 h-2 bg-emerald-500 mb-8 rounded-full"></div>
          <h2 className="text-5xl font-black mb-6 leading-tight drop-shadow-lg">
            Host or <br /> Be Hosted.
          </h2>
          <p className="text-xl text-gray-200 font-medium max-w-lg drop-shadow-md">
            Whether you're listing a luxury garden or booking a corporate hall, Locyfy makes it effortless.
          </p>
        </div>
      </div>
    </div>
  );
};
