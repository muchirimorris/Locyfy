import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ExploreHub } from './components/venue/ExploreHub';
import { VenueDetails } from './components/venue/VenueDetails';
import { VendorDashboard } from './components/vendor/VendorDashboard';
import { Checkout } from './components/booking/Checkout';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { useAuthStore } from './store/authStore';
import type { Venue } from './types/venue';
import apiClient from './services/apiClient';

const mockVenues: Venue[] = [
  {
    id: 'v1',
    name: 'Karura Forest Event Grounds',
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
    eventLocation: {
      id: 'loc1',
      name: 'Main Gate Grounds',
      subCounty: 'Gigiri',
      county: 'Nairobi',
      idealFor: ['Weddings', 'Corporate', 'Photo Shoots'],
      terrain: 'Forest',
    },
    pricePerDay: 150000,
    capacity: 300,
    isLocyfyVerified: true,
    mlRecommendationScore: 96,
    amenities: ['Ample parking', 'Backup Generator/Inverter', 'Security Guards'],
  }
];

// Inner component so we can use hooks like useNavigate
function Navigation() {
  const { isAuthenticated, isVendor, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete apiClient.defaults.headers['Authorization'];
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
      <Link to="/" className="text-2xl font-extrabold text-emerald-400 tracking-tight">Locyfy.</Link>
      
      <div className="flex gap-4 items-center">
        {isAuthenticated ? (
          <>
             {isVendor && (
                 <Link to="/vendor-dashboard" className="text-sm font-bold text-white hover:text-emerald-400 transition-colors">Dashboard</Link>
             )}
             <button onClick={handleLogout} className="px-5 py-2 bg-gray-800 text-white text-sm font-bold rounded-xl hover:bg-gray-700 transition-colors">Log Out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-bold text-white hover:text-emerald-400 transition-colors">Log In</Link>
            <Link to="/register" className="px-5 py-2 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-400 transition-colors">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navigation />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<ExploreHub initialVenues={mockVenues} />} />
            <Route path="/venue/:id" element={<VenueDetails />} />
            <Route path="/vendor-dashboard" element={<VendorDashboard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
