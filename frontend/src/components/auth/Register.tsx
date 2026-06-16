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
    } catch (err: any) {
      console.error('Registration error', err);
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 py-12">
      <div className="bg-white max-w-lg w-full rounded-3xl p-8 border border-gray-100 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Create an Account</h1>
          <p className="text-gray-500 font-medium">Join Locyfy today</p>
        </div>

        {/* Role Selection */}
        <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
          <button 
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${role === 'user' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setRole('user')}
          >
            I am a Customer
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${role === 'vendor' ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setRole('vendor')}
          >
            I am a Vendor
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" required
                  value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-gray-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
              <input 
                type="text" required
                value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" required placeholder="you@example.com"
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password" required placeholder="••••••••" minLength={8}
                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-gray-900"
              />
            </div>
          </div>

          {/* Vendor Specific KYC Fields */}
          {role === 'vendor' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-5 border-t border-gray-100 pt-5 mt-5">
              <div>
                <label className="block text-sm font-bold text-emerald-800 mb-2">KRA PIN Number</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" required placeholder="P000000000A"
                    value={formData.kraPin} onChange={(e) => setFormData({...formData, kraPin: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-900 uppercase"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-emerald-800 mb-2">Business Registration Certificate</label>
                <div className="relative border-2 border-dashed border-emerald-200 rounded-xl p-4 text-center hover:bg-emerald-50 cursor-pointer transition-colors">
                  <FileCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-emerald-700">Click to upload PDF</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">Required for Locyfy Verification badge</p>
                </div>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-lg flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm font-medium text-gray-500 mt-8">
          Already have an account? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};
