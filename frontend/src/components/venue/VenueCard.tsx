import React from 'react';
import { Star, MapPin, Users, ShieldCheck } from 'lucide-react';
import type { Venue } from '../../types/venue';

interface VenueCardProps {
  venue: Venue;
  onClick: (id: string) => void;
}

export const VenueCard: React.FC<VenueCardProps> = ({ venue, onClick }) => {
  const {
    id,
    name,
    imageUrl,
    locations,
    pricePerDay,
    capacity,
    isLocyfyVerified,
    mlRecommendationScore
  } = venue;

  return (
    <div 
      onClick={() => onClick(id)}
      className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100">
        <img 
          src={imageUrl || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600"} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {isLocyfyVerified && (
            <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified
            </div>
          )}
        </div>
        
        {/* Bottom Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-10">
           <div className="flex flex-col gap-1 text-white">
              <span className="text-xs font-semibold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md w-fit">
                {locations && locations[0]?.terrain}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium drop-shadow-md truncate max-w-[200px]">
                  {locations && locations.length > 0 ? (
                    <>{locations[0].subCounty}, {locations[0].county} {locations.length > 1 ? `(+${locations.length - 1})` : ''}</>
                  ) : (
                    'Location unavailable'
                  )}
                </span>
              </div>
           </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md shrink-0">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span className="text-sm font-bold text-amber-700">4.8</span>
          </div>
        </div>

        {/* Locyfy Score */}
        {mlRecommendationScore && (
           <div className="flex items-center gap-1.5 mb-4">
             <div className="w-full bg-gray-100 rounded-full h-1.5">
               <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${mlRecommendationScore}%` }}></div>
             </div>
             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
               {mlRecommendationScore}% Match
             </span>
           </div>
        )}
        
        {/* Ideal For (Tags) */}
        {locations && locations[0]?.idealFor && locations[0].idealFor.length > 0 && (
           <div className="flex flex-wrap gap-2 mb-6">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-wider py-1">Ideal For:</span>
             {locations[0].idealFor.slice(0, 3).map((ideal: string, idx: number) => (
               <span key={idx} className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                 {ideal}
               </span>
             ))}
           </div>
        )}

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold">Up to {capacity}</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-gray-500">From </span>
            <span className="text-lg font-black text-gray-900">Ksh {Number(pricePerDay).toLocaleString()}</span>
            <span className="text-xs text-gray-500 font-medium">/day</span>
          </div>
        </div>
      </div>
    </div>
  );
};
