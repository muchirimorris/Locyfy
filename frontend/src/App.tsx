import { useState } from 'react';
import { ExploreHub } from './components/venue/ExploreHub';
import { VendorProfile } from './components/vendor/VendorProfile';
import { Checkout } from './components/booking/Checkout';
import type { Venue } from './types/venue';

const mockVenues: Venue[] = [
  // Keeping just one mock venue here to keep it concise, since the focus is switching views
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

function App() {
  const [currentView, setCurrentView] = useState<'explore' | 'vendor' | 'checkout'>('explore');

  return (
    <div>
      {/* Dev Navigation Bar - strictly for the client demo to switch screens */}
      <div className="bg-gray-900 text-white p-4 flex gap-4 justify-center shadow-lg sticky top-0 z-50">
        <span className="font-bold mr-4 text-emerald-400">Locyfy Demo Navigation:</span>
        <button 
          className={`px-4 py-1 rounded-full font-medium text-sm transition-colors ${currentView === 'explore' ? 'bg-emerald-500' : 'bg-gray-800 hover:bg-gray-700'}`}
          onClick={() => setCurrentView('explore')}
        >
          1. Explore Hub
        </button>
        <button 
          className={`px-4 py-1 rounded-full font-medium text-sm transition-colors ${currentView === 'vendor' ? 'bg-emerald-500' : 'bg-gray-800 hover:bg-gray-700'}`}
          onClick={() => setCurrentView('vendor')}
        >
          2. Vendor Profile
        </button>
        <button 
          className={`px-4 py-1 rounded-full font-medium text-sm transition-colors ${currentView === 'checkout' ? 'bg-emerald-500' : 'bg-gray-800 hover:bg-gray-700'}`}
          onClick={() => setCurrentView('checkout')}
        >
          3. Checkout & Payment
        </button>
      </div>

      {currentView === 'explore' && <ExploreHub initialVenues={mockVenues} />}
      {currentView === 'vendor' && <VendorProfile />}
      {currentView === 'checkout' && <Checkout />}
    </div>
  );
}

export default App;
