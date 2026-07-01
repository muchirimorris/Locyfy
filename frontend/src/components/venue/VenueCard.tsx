import React from 'react';
import { motion } from 'framer-motion';
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
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } }
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(id)}
      className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:border-emerald-500/30 transition-all duration-500 cursor-pointer flex flex-col h-full relative"
    >
      {/* Image Section */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-100">
        <motion.img 
          whileHover={{ scale: 1.25, rotate: 3, filter: 'saturate(1.5) brightness(1.1)' }}
          transition={{ duration: 0.8, type: "spring", stiffness: 60, damping: 15 }}
          src={imageUrl || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600"} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-80 group-hover:opacity-100 group-hover:bg-emerald-900/20 transition-all duration-500 pointer-events-none mix-blend-multiply" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          {isLocyfyVerified && (
            <div className="bg-emerald-500 text-white text-xs font-black tracking-wide px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
            </div>
          )}
        </div>
        
        {/* Bottom Info Overlay */}
        <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end z-10">
           <div className="flex flex-col gap-1.5 text-white">
              <span className="text-[11px] font-black tracking-wider uppercase bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full w-fit">
                {locations && locations[0]?.terrain}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold drop-shadow-md truncate max-w-[200px]">
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
      <div className="p-6 flex flex-col flex-grow">
        
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-black text-gray-900 line-clamp-1 group-hover:text-emerald-500 transition-colors duration-300">
            {name}
          </h3>
          <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full shrink-0 border border-amber-100">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span className="text-xs font-bold text-amber-700">4.8</span>
          </div>
        </div>

        {/* Locyfy Score */}
        {mlRecommendationScore && (
           <div className="flex items-center gap-2 mb-5 group-hover:transform group-hover:translate-x-1 transition-transform duration-300">
             <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
               <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full" style={{ width: `${mlRecommendationScore}%` }}></div>
             </div>
             <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider whitespace-nowrap">
               {mlRecommendationScore}% Match
             </span>
           </div>
        )}
        
        {/* Ideal For (Tags) */}
        {locations && locations[0]?.idealFor && locations[0].idealFor.length > 0 && (
           <div className="flex flex-wrap gap-2 mb-6">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest py-1.5">IDEAL FOR:</span>
             {locations[0].idealFor.slice(0, 3).map((ideal: string, idx: number) => (
               <span key={idx} className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50">
                 {ideal}
               </span>
             ))}
           </div>
        )}

        <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wide">Up to {capacity}</span>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">From </span>
            <span className="text-xl font-black text-gray-900 tracking-tight">Ksh {Number(pricePerDay).toLocaleString()}</span>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">/day</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
