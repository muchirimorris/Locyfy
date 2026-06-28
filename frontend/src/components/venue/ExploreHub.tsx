import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Map, Loader2, AlertCircle } from 'lucide-react';
import { VenueCard } from './VenueCard';
import type { Venue } from '../../types/venue';
import { venueService } from '../../services/venueService';

interface ExploreHubProps {
  initialVenues: Venue[];
}

import { useNavigate } from 'react-router-dom';

export const ExploreHub: React.FC<ExploreHubProps> = ({ initialVenues }) => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCounty, setSelectedCounty] = useState<string>('All');
  const [selectedTerrain, setSelectedTerrain] = useState<string>('All');
  const [selectedIdealFor, setSelectedIdealFor] = useState<string>('All');

  const counties = ['All', 'Nairobi', 'Kiambu', 'Mombasa', 'Nakuru', 'Nyeri'];
  const terrains = ['All', 'Manicured Gardens', 'Indoor Hall', 'Rooftop', 'Lakeside', 'Forest'];
  const idealForOptions = ['All', 'Weddings', 'Corporate', 'Concerts', 'Photo Shoots', 'Chama Meetings'];

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        // Attempt to fetch from Django Backend
        const data = await venueService.getVenues();
        setVenues(data);
        setError(null);
      } catch (err) {
        console.error('API Connection failed (Django might be offline):', err);
        setError('Cannot connect to live server. Falling back to demo data.');
        setVenues(initialVenues);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [initialVenues]);

  const filteredVenues = useMemo(() => {
    return venues.filter(venue => {
      const matchesSearch = !searchQuery || 
                            venue.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            venue.locations?.some(loc => loc.subCounty.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCounty = selectedCounty === 'All' || venue.locations?.some(loc => loc.county === selectedCounty);
      const matchesTerrain = selectedTerrain === 'All' || venue.locations?.some(loc => loc.terrain === selectedTerrain);
      const matchesIdeal = selectedIdealFor === 'All' || venue.locations?.some(loc => loc.idealFor?.includes(selectedIdealFor as string));

      return matchesSearch && matchesCounty && matchesTerrain && matchesIdeal;
    });
  }, [venues, searchQuery, selectedCounty, selectedTerrain, selectedIdealFor]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Search Section */}
      <div className="relative pt-32 pb-24 px-6 lg:px-12 overflow-hidden bg-gray-900 text-white flex items-center justify-center border-b border-gray-800">
        
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
           <div className="absolute top-12 -right-12 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '2s' }}></div>
           <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '4s' }}></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto relative z-10 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-6 drop-shadow-lg">
            Discover Exceptional <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">Spaces.</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
            From lush manicured gardens in Kiambu to premium corporate halls in Nairobi. Find your perfect verified venue instantly.
          </p>

          <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
            {/* Search Input */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-14 pr-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-glass font-medium text-lg outline-none"
                placeholder="Search venues or areas (e.g., Gigiri)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Action Buttons */}
            <button className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-full font-bold hover:bg-emerald-400 transition-colors shadow-glow hover:shadow-glow-lg flex-shrink-0">
              <Map className="w-5 h-5" />
              <span>Map View</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-6">
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar Filters */}
        <motion.aside 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full lg:w-72 flex-shrink-0"
        >
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 sticky top-28">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
              <Filter className="w-4 h-4 text-emerald-500" /> Filters
            </h3>
            
            {/* County Filter */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-900 mb-3">County</label>
              <div className="relative">
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none appearance-none cursor-pointer transition-shadow hover:shadow-sm"
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                >
                  {counties.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* Terrain Filter */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-900 mb-3">Venue Terrain</label>
              <div className="space-y-3">
                {terrains.map(terrain => (
                  <label key={terrain} className="flex items-center gap-3 cursor-pointer group p-2 -ml-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <input 
                      type="radio" 
                      name="terrain" 
                      value={terrain}
                      checked={selectedTerrain === terrain}
                      onChange={(e) => setSelectedTerrain(e.target.value)}
                      className="w-4 h-4 text-emerald-500 border-gray-300 focus:ring-emerald-500 cursor-pointer" 
                    />
                    <span className="text-sm text-gray-600 font-semibold group-hover:text-gray-900 transition-colors">{terrain}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ideal For Filter */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-900 mb-3">Ideal For</label>
              <div className="space-y-3">
                {idealForOptions.map(ideal => (
                  <label key={ideal} className="flex items-center gap-3 cursor-pointer group p-2 -ml-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <input 
                      type="radio" 
                      name="idealFor" 
                      value={ideal}
                      checked={selectedIdealFor === ideal}
                      onChange={(e) => setSelectedIdealFor(e.target.value)}
                      className="w-4 h-4 text-emerald-500 border-gray-300 focus:ring-emerald-500 cursor-pointer" 
                    />
                    <span className="text-sm text-gray-600 font-semibold group-hover:text-gray-900 transition-colors">{ideal}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </motion.aside>

        {/* Results Grid */}
        <main className="flex-grow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {filteredVenues.length} {filteredVenues.length === 1 ? 'Venue' : 'Venues'} Found
            </h2>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              Sort by: <span className="text-gray-900 font-bold cursor-pointer">Highest Match</span>
            </div>
          </div>

          {loading ? (
             <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Fetching verified venues...</h3>
             </div>
          ) : filteredVenues.length > 0 ? (
            <motion.div 
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.1 } }
              }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {filteredVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} onClick={(id) => navigate(`/venue/${id}`)} />
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-gray-100 border-dashed">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No venues found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your filters or search query.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCounty('All');
                  setSelectedTerrain('All');
                  setSelectedIdealFor('All');
                }}
                className="mt-6 px-6 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-xl hover:bg-emerald-100 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>

      </div>
    </div>
  );
};
