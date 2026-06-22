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
      <div className="bg-gray-900 text-white pt-10 pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">My Dashboard</h1>
            <p className="text-emerald-400 font-medium flex items-center gap-2">
              <Tent className="w-4 h-4" /> Welcome back!
            </p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-400 transition-colors shadow-lg"
          >
            Explore Venues
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-10">
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CalendarCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-500 font-medium text-sm mb-1">Upcoming Events</p>
            <h3 className="text-2xl font-black text-gray-900">{upcomingBookings.length}</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-gray-500 font-medium text-sm mb-1">Total Spent</p>
            <h3 className="text-2xl font-black text-gray-900">Ksh {totalSpent.toLocaleString()}</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-500 font-medium text-sm mb-1">Total Bookings</p>
            <h3 className="text-2xl font-black text-gray-900">{bookings.length}</h3>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-extrabold text-gray-900">Booking History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold border-b border-gray-100">Venue</th>
                  <th className="p-4 font-bold border-b border-gray-100">Date</th>
                  <th className="p-4 font-bold border-b border-gray-100">Amount</th>
                  <th className="p-4 font-bold border-b border-gray-100">Booking Status</th>
                  <th className="p-4 font-bold border-b border-gray-100">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">No bookings found yet. Go explore venues!</td>
                  </tr>
                ) : (
                  bookings.map((booking: Booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        {booking.transaction && (
                          <div className="font-medium text-gray-900">
                             {/* Displaying venue logic. 
                                 Unfortunately, BookingSerializer only has the ID of the venue unless we nested it. 
                                 Wait, let me check the BookingSerializer in backend.
                                 BookingSerializer has fields = '__all__'. It does not nest Venue.
                                 Let me just show Booking ID for now, or fetch venue detail if it was nested.
                             */}
                             Booking #{booking.id}
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-medium text-gray-600">{booking.booking_date}</td>
                      <td className="p-4 font-bold text-gray-900">Ksh {Number(booking.total_amount).toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          booking.transaction?.payment_status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
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
