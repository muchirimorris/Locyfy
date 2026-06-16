import React from 'react';
import { MapPin, Users, CheckCircle, Sparkles } from 'lucide-react';
import type { VenueCardProps } from '../../types/venue';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge tailwind classes
 */
function cn(...classes: (string | undefined | null | false)[]) {
  return twMerge(clsx(classes));
}

export const VenueCard: React.FC<VenueCardProps> = ({ venue, onClick }) => {
  const {
    id,
    name,
    imageUrl,
    location,
    pricePerHour,
    capacity,
    isVerified,
    mlRecommendationScore,
    tags,
  } = venue;

  return (
    <div
      onClick={() => onClick?.(id)}
      className={cn(
        "group relative flex flex-col w-full max-w-sm rounded-3xl overflow-hidden cursor-pointer",
        "bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
        "transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)]"
      )}
    >
      {/* Image Container */}
      <div className="relative h-60 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        
        {/* Gradient Overlay for text legibility if needed later, and general aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-80" />

        {/* Top-left Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isVerified && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-white/20">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-semibold tracking-wide text-gray-800">Verified</span>
            </div>
          )}
        </div>

        {/* Top-right ML Recommendation Score */}
        {mlRecommendationScore !== undefined && (
          <div className="absolute top-4 right-4">
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg",
              mlRecommendationScore >= 90 ? "bg-gradient-to-r from-purple-500/90 to-pink-500/90 border-pink-400/30 text-white" :
              mlRecommendationScore >= 75 ? "bg-gradient-to-r from-emerald-400/90 to-teal-500/90 border-teal-400/30 text-white" :
              "bg-white/90 border-white/20 text-gray-800"
            )}>
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold">{mlRecommendationScore}% Match</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-6 relative">
        {/* Price Tag positioned over the image-content border */}
        <div className="absolute -top-6 right-6 px-4 py-2 bg-gray-900 text-white rounded-2xl shadow-xl border border-gray-800 transform transition-transform group-hover:scale-105">
          <span className="text-lg font-bold">Ksh {pricePerHour.toLocaleString()}</span>
          <span className="text-xs text-gray-300 font-medium tracking-wide"> / hr</span>
        </div>

        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-tight line-clamp-1">
            {name}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-gray-500 mb-4">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium truncate">
            {location.estate ? `${location.estate}, ` : ''}{location.county}
          </span>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-lg border border-primary-100"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2.5 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-lg border border-gray-200">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-gray-500" />
            </div>
            <span className="text-sm font-semibold">Up to {capacity}</span>
          </div>

          <button className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors focus:ring-4 focus:ring-gray-200">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
