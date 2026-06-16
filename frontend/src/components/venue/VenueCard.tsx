import React from 'react';
import { MapPin, Users, ShieldCheck, Sparkles, Zap, Car, Coffee, Info } from 'lucide-react';
import type { VenueCardProps } from '../../types/venue';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...classes: (string | undefined | null | false)[]) {
  return twMerge(clsx(classes));
}

// Helper to get an icon for specific amenities
const getAmenityIcon = (amenity: string) => {
  if (amenity.includes('catering')) return <Coffee className="w-3.5 h-3.5" />;
  if (amenity.includes('parking')) return <Car className="w-3.5 h-3.5" />;
  if (amenity.includes('Generator')) return <Zap className="w-3.5 h-3.5" />;
  return <Info className="w-3.5 h-3.5" />;
};

export const VenueCard: React.FC<VenueCardProps> = ({ venue, onClick }) => {
  const {
    id,
    name,
    imageUrl,
    eventLocation,
    pricePerDay,
    capacity,
    isLocyfyVerified,
    mlRecommendationScore,
    amenities,
  } = venue;

  return (
    <div
      onClick={() => onClick?.(id)}
      className={cn(
        "group relative flex flex-col w-full bg-white rounded-[2rem] overflow-hidden cursor-pointer",
        "border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]",
        "transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)]"
      )}
    >
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        
        {/* Subtle bottom gradient for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent opacity-90" />

        {/* Top-left Verified Badge */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {isLocyfyVerified && (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/90 backdrop-blur-md shadow-lg border border-emerald-400/30">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span className="text-xs font-bold tracking-wide text-white uppercase">Locyfy Verified</span>
            </div>
          )}
        </div>

        {/* Top-right ML Recommendation Score */}
        {mlRecommendationScore !== undefined && (
          <div className="absolute top-4 right-4 z-10">
            <div className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-lg transition-transform group-hover:scale-105",
              mlRecommendationScore >= 90 ? "bg-gradient-to-r from-purple-600/95 to-pink-500/95 border border-pink-400/30 text-white" :
              mlRecommendationScore >= 75 ? "bg-gradient-to-r from-blue-600/95 to-teal-500/95 border border-teal-400/30 text-white" :
              "bg-white/95 border border-white/20 text-gray-800"
            )}>
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-extrabold">{mlRecommendationScore}% Match</span>
            </div>
          </div>
        )}

        {/* Floating location info positioned at the bottom of the image */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-10">
           <div className="flex flex-col gap-1 text-white">
              <span className="text-xs font-semibold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md w-fit">
                {eventLocation.terrain}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium drop-shadow-md">
                  {eventLocation.subCounty}, {eventLocation.county}
                </span>
              </div>
           </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-6 relative bg-white">
        {/* Price Tag positioned bridging image and content */}
        <div className="absolute -top-7 right-6 px-5 py-2.5 bg-gray-900 text-white rounded-2xl shadow-xl border border-gray-800 transform transition-transform group-hover:scale-105">
          <span className="text-lg font-black">Ksh {pricePerDay.toLocaleString()}</span>
          <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase ml-1">/ Day</span>
        </div>

        <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-tight line-clamp-1 pr-24 mb-3">
          {name}
        </h3>

        {/* Amenities Highlights */}
        {amenities && amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {amenities.slice(0, 3).map((amenity, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 rounded-lg border border-gray-200/60"
              >
                {getAmenityIcon(amenity)}
                <span>{amenity}</span>
              </div>
            ))}
            {amenities.length > 3 && (
              <div className="flex items-center px-2.5 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50 rounded-lg border border-gray-200/60">
                +{amenities.length - 3} more
              </div>
            )}
          </div>
        )}
        
        {/* Ideal For (Tags) */}
        {eventLocation.idealFor && eventLocation.idealFor.length > 0 && (
           <div className="flex flex-wrap gap-2 mb-6">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-wider py-1">Ideal For:</span>
             {eventLocation.idealFor.slice(0, 3).map((ideal, idx) => (
               <span key={idx} className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                 {ideal}
               </span>
             ))}
           </div>
        )}

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700">
            <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-sm font-bold">Up to {capacity}</span>
          </div>

          <button className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-emerald-600 transition-colors focus:ring-4 focus:ring-emerald-200 shadow-md">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
