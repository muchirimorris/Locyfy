import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import apiClient from '../../services/apiClient';
import { Building2, CalendarCheck, DollarSign, Loader2, Star, TrendingUp } from 'lucide-react';
import { AddVenueModal } from './AddVenueModal';

interface Transaction {
  payment_status?: string;
}

interface Booking {
  id: string | number;
  status: string;
  total_amount: number | string;
  booking_date: string;
  transaction?: Transaction;
}

export const VendorDashboard: React.FC = () => {
  const { isAuthenticated, isVendor } = useAuthStore();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_revenue: 0,
    pending_bookings: 0,
    upcoming_bookings: 0,
    total_venues: 0
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        apiClient.get('/vendor/dashboard/'),
        apiClient.get('/vendor/bookings/')
      ]);
      
      setStats(statsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isVendor) {
      navigate('/');
      return;
    }
    const init = async () => {
      await fetchDashboardData();
    };
    void init();
  }, [isAuthenticated, isVendor, navigate, fetchDashboardData]);

  const handleVenueAdded = () => {
    setIsModalOpen(false);
    setLoading(true); // show loader while fetching new stats
    fetchDashboardData(); // Refetch data!
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Modal Overlay */}
      <AddVenueModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleVenueAdded} 
      />

      {/* Dashboard Header */}
      <div className="relative bg-gray-900 text-white pt-24 pb-28 px-6 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-emerald-600/20 mix-blend-multiply" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between md:items-end relative z-10 gap-6">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl font-black tracking-tight mb-2 drop-shadow-lg">Vendor Dashboard</h1>
            <p className="text-emerald-400 font-bold tracking-wide flex items-center gap-2 uppercase text-sm">
              <Building2 className="w-5 h-5" /> Locyfy Verified Partner
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-gray-900 px-6 py-3.5 rounded-full font-black text-sm tracking-wide hover:bg-gray-100 transition-all shadow-glow hover:-translate-y-1 w-fit flex items-center gap-2"
          >
            <span>+</span> ADD NEW VENUE
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-16 relative z-20">
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full filter blur-xl group-hover:bg-emerald-500/20 transition-colors" />
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                <DollarSign className="w-7 h-7" />
              </div>
              <span className="flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-full gap-1 uppercase tracking-widest border border-emerald-100">
                <TrendingUp className="w-3 h-3" /> +12%
              </span>
            </div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Total Revenue</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Ksh {stats.total_revenue.toLocaleString()}</h3>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full filter blur-xl group-hover:bg-blue-500/20 transition-colors" />
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                <CalendarCheck className="w-7 h-7" />
              </div>
            </div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Upcoming Bookings</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stats.upcoming_bookings} <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">confirmed</span></h3>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full filter blur-xl group-hover:bg-amber-500/20 transition-colors" />
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
                <Star className="w-7 h-7" />
              </div>
            </div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Locyfy Rating</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">4.9 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">/ 5.0</span></h3>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full filter blur-xl group-hover:bg-purple-500/20 transition-colors" />
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-inner">
                <Building2 className="w-7 h-7" />
              </div>
            </div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Active Venues</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stats.total_venues} <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">listed</span></h3>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-black text-gray-900">Recent Bookings</h2>
            <button className="text-[10px] font-black tracking-widest uppercase text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full transition-colors border border-emerald-100">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest font-black">
                  <th className="p-5 border-b border-gray-100">Booking ID</th>
                  <th className="p-5 border-b border-gray-100">Date</th>
                  <th className="p-5 border-b border-gray-100">Amount</th>
                  <th className="p-5 border-b border-gray-100">Booking Status</th>
                  <th className="p-5 border-b border-gray-100">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400 font-bold">No bookings found yet.</td>
                  </tr>
                ) : (
                  bookings.map((booking: Booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="p-5">
                        <span className="font-mono text-sm font-black text-gray-900">#{booking.id}</span>
                      </td>
                      <td className="p-5 font-semibold text-gray-500">{booking.booking_date}</td>
                      <td className="p-5 font-black text-gray-900">Ksh {Number(booking.total_amount).toLocaleString()}</td>
                      <td className="p-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-black ${
                          booking.status === 'Confirmed' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-5">
                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-black ${
                          booking.transaction?.payment_status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-50 text-gray-600 border border-gray-200'
                        }`}>
                          {booking.transaction?.payment_status || 'Unpaid'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
