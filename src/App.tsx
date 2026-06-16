import { VenueCard } from './components/venue/VenueCard';
import type { Venue } from './types/venue';

const mockVenue: Venue = {
  id: 'v1',
  name: 'Karura Forest Event Grounds',
  imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
  location: {
    address: 'Limuru Road',
    county: 'Nairobi',
    estate: 'Gigiri',
    landmark: 'Near the Main Gate'
  },
  pricePerHour: 15000,
  capacity: 300,
  isVerified: true,
  mlRecommendationScore: 94,
  tags: ['Outdoor', 'Ruracio', 'Corporate', 'Nyama Choma']
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <VenueCard venue={mockVenue} onClick={(id) => console.log('Clicked', id)} />
    </div>
  );
}

export default App;
