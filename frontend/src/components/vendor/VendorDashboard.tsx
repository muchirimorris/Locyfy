import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import apiClient from '../../services/apiClient';
import { Building2, CalendarCheck, DollarSign, Loader2, Star, TrendingUp } from 'lucide-react';
import { AddVenueModal } from './AddVenueModal';

export const VendorDashboard: React.FC = () => {
  const { isAuthenticated, isVendor } = useAuthStore();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_revenue: 0,
    pending_bookings: 0,
    upcoming_bookings: 0,
    total_venues: 0
  });
  const [bookings, setBookings] = useState<any[]>([]);
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
    fetchDashboardData();
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
      <div className="bg-gray-900 text-white pt-10 pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Vendor Dashboard</h1>
            <p className="text-emerald-400 font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Locyfy Verified Partner
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-gray-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg"
          >
            + Add New Venue
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-10">
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full gap-1">
                <TrendingUp className="w-3 h-3" /> +12%
              </span>
            </div>
            <p className="text-gray-500 font-medium text-sm mb-1">Total Revenue</p>
            <h3 className="text-2xl font-black text-gray-900">Ksh {stats.total_revenue.toLocaleString()}</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CalendarCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-500 font-medium text-sm mb-1">Upcoming Bookings</p>
            <h3 className="text-2xl font-black text-gray-900">{stats.upcoming_bookings} <span className="text-sm font-medium text-gray-500 ml-1">confirmed</span></h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-gray-500 font-medium text-sm mb-1">Locyfy Rating</p>
            <h3 className="text-2xl font-black text-gray-900">4.9 <span className="text-sm font-medium text-gray-500 ml-1">/ 5.0</span></h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-500 font-medium text-sm mb-1">Active Venues</p>
            <h3 className="text-2xl font-black text-gray-900">{stats.total_venues} <span className="text-sm font-medium text-gray-500 ml-1">listed</span></h3>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-extrabold text-gray-900">Recent Bookings</h2>
            <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold border-b border-gray-100">Booking ID</th>
                  <th className="p-4 font-bold border-b border-gray-100">Date</th>
                  <th className="p-4 font-bold border-b border-gray-100">Amount</th>
                  <th className="p-4 font-bold border-b border-gray-100">Booking Status</th>
                  <th className="p-4 font-bold border-b border-gray-100">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">No bookings found yet.</td>
                  </tr>
                ) : (
                  bookings.map((booking: any) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-sm font-bold text-gray-900">#{booking.id}</span>
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
