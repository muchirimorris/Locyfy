import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ExploreHub } from './components/venue/ExploreHub';
import { VenueDetails } from './components/venue/VenueDetails';
import { VendorDashboard } from './components/vendor/VendorDashboard';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
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
    locations: [{
      id: 'loc1',
      name: 'Gigiri Grounds',
      county: 'Nairobi',
      subCounty: 'Gigiri',
      terrain: 'Manicured Gardens',
      idealFor: ['Weddings', 'Corporate', 'Photo Shoots'],
    }],
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
    <div className="fixed w-full top-6 z-50 flex justify-center px-4 animate-fade-in-up">
      <nav className="glass-dark text-white px-6 py-3.5 rounded-full flex justify-between items-center shadow-glow max-w-4xl w-full transition-all duration-300">
        <Link to="/" className="text-2xl font-black text-emerald-400 tracking-tight hover:text-emerald-300 transition-colors">
          Locyfy<span className="text-white">.</span>
        </Link>
        
        <div className="flex gap-6 items-center">
          {isAuthenticated ? (
            <>
               {isVendor ? (
                   <Link to="/vendor-dashboard" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors relative group">
                     Dashboard
                     <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                   </Link>
               ) : (
                   <Link to="/dashboard" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors relative group">
                     My Bookings
                     <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                   </Link>
               )}
               <button onClick={handleLogout} className="px-5 py-2.5 bg-white/10 text-white text-sm font-bold rounded-full hover:bg-white/20 transition-colors border border-white/10 backdrop-blur-md">Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">Log In</Link>
              <Link to="/register" className="px-5 py-2.5 bg-emerald-500 text-white text-sm font-bold rounded-full hover:bg-emerald-400 transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navigation />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<ExploreHub initialVenues={mockVenues} />} />
            <Route path="/venue/:id" element={<VenueDetails />} />
            <Route path="/vendor-dashboard" element={<VendorDashboard />} />
            <Route path="/dashboard" element={<CustomerDashboard />} />
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
