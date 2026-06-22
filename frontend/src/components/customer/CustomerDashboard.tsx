import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import apiClient from '../../services/apiClient';
import { CalendarCheck, DollarSign, Loader2, Star, Tent } from 'lucide-react';

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

export const CustomerDashboard: React.FC = () => {
  const { isAuthenticated, isVendor } = useAuthStore();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // If the user is a vendor, they should go to the vendor dashboard
    if (isVendor) {
      navigate('/vendor-dashboard');
      return;
    }
    const fetchBookings = async () => {
      try {
        const bookingsRes = await apiClient.get('/customer/bookings/');
        setBookings(bookingsRes.data);
      } catch (error) {
        console.error("Failed to fetch customer bookings", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchBookings();
  }, [isAuthenticated, isVendor, navigate]);

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  // Calculate stats from bookings
  const upcomingBookings = bookings.filter(b => b.status === 'Confirmed');
  const totalSpent = bookings.reduce((sum, b) => {
    if (b.status === 'Confirmed' || b.transaction?.payment_status === 'Completed') {
      return sum + Number(b.total_amount);
    }
    return sum;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Dashboard Header */}
      <div className="relative bg-gray-900 text-white pt-24 pb-28 px-6 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 mix-blend-multiply" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between md:items-end relative z-10 gap-6">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl font-black tracking-tight mb-2 drop-shadow-lg">My Dashboard</h1>
            <p className="text-emerald-400 font-bold tracking-wide flex items-center gap-2 uppercase text-sm">
              <Tent className="w-5 h-5" /> Welcome back to Locyfy
            </p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="bg-emerald-500 text-white px-6 py-3.5 rounded-full font-black text-sm tracking-wide hover:bg-emerald-400 transition-all shadow-glow hover:-translate-y-1 w-fit"
          >
            EXPLORE VENUES
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-16 relative z-20">
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full filter blur-xl group-hover:bg-blue-500/20 transition-colors" />
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                <CalendarCheck className="w-7 h-7" />
              </div>
            </div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Upcoming Events</p>
            <h3 className="text-4xl font-black text-gray-900 tracking-tight">{upcomingBookings.length}</h3>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full filter blur-xl group-hover:bg-emerald-500/20 transition-colors" />
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                <DollarSign className="w-7 h-7" />
              </div>
            </div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Total Spent</p>
            <h3 className="text-4xl font-black text-gray-900 tracking-tight">Ksh {totalSpent.toLocaleString()}</h3>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full filter blur-xl group-hover:bg-purple-500/20 transition-colors" />
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-inner">
                <Star className="w-7 h-7" />
              </div>
            </div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Total Bookings</p>
            <h3 className="text-4xl font-black text-gray-900 tracking-tight">{bookings.length}</h3>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-black text-gray-900">Booking History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest font-black">
                  <th className="p-5 border-b border-gray-100">Venue</th>
                  <th className="p-5 border-b border-gray-100">Date</th>
                  <th className="p-5 border-b border-gray-100">Amount</th>
                  <th className="p-5 border-b border-gray-100">Booking Status</th>
                  <th className="p-5 border-b border-gray-100">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400 font-bold">No bookings found yet. Go explore venues!</td>
                  </tr>
                ) : (
                  bookings.map((booking: Booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="p-5">
                        {booking.transaction && (
                          <div className="font-bold text-gray-900">
                             Booking #{booking.id}
                          </div>
                        )}
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
