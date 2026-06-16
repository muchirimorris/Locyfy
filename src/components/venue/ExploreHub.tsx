import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Map } from 'lucide-react';
import { VenueCard } from './VenueCard';
import type { Venue } from '../../types/venue';

interface ExploreHubProps {
  initialVenues: Venue[];
}

export const ExploreHub: React.FC<ExploreHubProps> = ({ initialVenues }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCounty, setSelectedCounty] = useState<string>('All');
  const [selectedTerrain, setSelectedTerrain] = useState<string>('All');
  const [selectedIdealFor, setSelectedIdealFor] = useState<string>('All');

  const counties = ['All', 'Nairobi', 'Kiambu', 'Mombasa', 'Nakuru', 'Nyeri'];
  const terrains = ['All', 'Manicured Gardens', 'Indoor Hall', 'Rooftop', 'Lakeside', 'Forest'];
  const idealForOptions = ['All', 'Weddings', 'Corporate', 'Concerts', 'Photo Shoots', 'Chama Meetings'];

  const filteredVenues = useMemo(() => {
    return initialVenues.filter(venue => {
      const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            venue.eventLocation.subCounty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCounty = selectedCounty === 'All' || venue.eventLocation.county === selectedCounty;
      const matchesTerrain = selectedTerrain === 'All' || venue.eventLocation.terrain === selectedTerrain;
      const matchesIdeal = selectedIdealFor === 'All' || venue.eventLocation.idealFor.includes(selectedIdealFor as any);

      return matchesSearch && matchesCounty && matchesTerrain && matchesIdeal;
    });
  }, [initialVenues, searchQuery, selectedCounty, selectedTerrain, selectedIdealFor]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Search Section */}
      <div className="bg-white border-b border-gray-200 pt-10 pb-8 px-6 lg:px-12 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Discover Exceptional Spaces
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-2xl">
            From lush manicured gardens in Kiambu to premium corporate halls in Nairobi. Find your perfect verified venue.
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-grow max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow shadow-sm font-medium"
                placeholder="Search by venue name or sub-county (e.g., Westlands)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">
                <SlidersHorizontal className="w-5 h-5" />
                <span>More Filters</span>
              </button>
              <button className="hidden md:flex items-center gap-2 px-6 py-3.5 bg-gray-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-colors shadow-md">
                <Map className="w-5 h-5" />
                <span>Map View</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-500" /> Quick Filters
            </h3>
            
            {/* County Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">County</label>
              <select 
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={selectedCounty}
                onChange={(e) => setSelectedCounty(e.target.value)}
              >
                {counties.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Terrain Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Venue Terrain</label>
              <div className="space-y-2">
                {terrains.map(terrain => (
                  <label key={terrain} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="terrain" 
                      value={terrain}
                      checked={selectedTerrain === terrain}
                      onChange={(e) => setSelectedTerrain(e.target.value)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500" 
                    />
                    <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900">{terrain}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ideal For Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ideal For</label>
              <div className="space-y-2">
                {idealForOptions.map(ideal => (
                  <label key={ideal} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="idealFor" 
                      value={ideal}
                      checked={selectedIdealFor === ideal}
                      onChange={(e) => setSelectedIdealFor(e.target.value)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500" 
                    />
                    <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900">{ideal}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </aside>

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

          {filteredVenues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} onClick={(id) => console.log('Navigate to venue', id)} />
              ))}
            </div>
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
