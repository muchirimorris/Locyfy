import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, CheckCircle2, PlayCircle, MapPin, Loader2 } from 'lucide-react';
import apiClient from '../../services/apiClient';
import type { Venue } from '../../types/venue';

export const VenueDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await apiClient.get(`/venues/${id}/`);
        setVenue(response.data);
      } catch (err) {
        console.error("Failed to fetch venue details", err);
        setError("Failed to load venue details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVenue();
  }, [id]);

  const handleBookNow = (packageType: string, calculatedPrice: number) => {
    if (!venue) return;
    
    navigate('/checkout', {
      state: {
        venueId: venue.id,
        venueName: venue.name,
        totalAmount: calculatedPrice,
        packageType: packageType
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600 font-bold">{error || "Venue not found"}</div>
      </div>
    );
  }

  const basePrice = Number(venue.pricePerDay);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Cover Image & Header */}
      <div className="relative h-72 md:h-96 w-full">
        <img 
          src={venue.imageUrl || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1920"} 
          alt={venue.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-24 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-extrabold text-gray-900">{venue.name}</h1>
              {venue.isLocyfyVerified && <ShieldCheck className="w-6 h-6 text-emerald-500" />}
            </div>
            <p className="text-gray-500 flex items-center gap-2 font-medium">
              <MapPin className="w-4 h-4 text-gray-400" />
              {venue.eventLocation?.subCounty}, {venue.eventLocation?.county}
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-amber-400 mb-1">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current text-gray-200" />
              </div>
              <span className="text-sm font-bold text-gray-900">4.8 (124 Reviews)</span>
            </div>
            <button 
              onClick={() => {
                // Default to first package or base price
                if (venue.packages && venue.packages.length > 0) {
                  handleBookNow(venue.packages[0].name, Number(venue.packages[0].price));
                } else {
                  handleBookNow("Base Package", basePrice);
                }
              }}
              className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-lg"
            >
              Book Now
            </button>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Description & Amenities */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Venue</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {venue.description || "A beautiful, premium event space perfect for your next gathering. Verified by Locyfy to ensure top-tier quality and reliability."}
              </p>

              <h3 className="text-lg font-bold text-gray-900 mb-4">Key Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 {(venue.amenities && venue.amenities.length > 0) ? venue.amenities.map((amenity: any, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-700 font-medium bg-gray-100 p-3 rounded-xl text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {typeof amenity === 'string' ? amenity : amenity.name}
                    </div>
                 )) : (
                    <div className="flex items-center gap-2 text-gray-700 font-medium bg-gray-100 p-3 rounded-xl text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Standard Amenities Included
                    </div>
                 )}
                 <div className="flex items-center gap-2 text-gray-700 font-medium bg-gray-100 p-3 rounded-xl text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Max Capacity: {venue.capacity} Pax
                 </div>
              </div>
            </section>

            {/* Media Gallery */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Media Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="col-span-2 md:col-span-2 row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer bg-gray-200">
                  <img src={venue.imageUrl || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Event Primary" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <PlayCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
                {venue.images && venue.images.length > 0 ? (
                  venue.images.map((img) => (
                    <div key={img.id} className="rounded-2xl overflow-hidden bg-gray-200">
                      <img src={img.image_url} className="w-full h-full object-cover hover:scale-105 transition-transform" alt="Gallery item" />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="rounded-2xl overflow-hidden bg-gray-200"><img src="https://images.unsplash.com/photo-1505236858219-8359eb29e325?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover hover:scale-105 transition-transform" alt="Placeholder 1" /></div>
                    <div className="rounded-2xl overflow-hidden bg-gray-200"><img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover hover:scale-105 transition-transform" alt="Placeholder 2" /></div>
                  </>
                )}
              </div>
            </section>

            {/* Reviews Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Punctuality & Reliability</h2>
              
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-6 flex gap-8 items-center">
                 <div className="text-center">
                   <p className="text-4xl font-black text-emerald-500">{venue.mlRecommendationScore || 95}%</p>
                   <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">Locyfy Score</p>
                 </div>
                 <div className="flex-grow border-l border-gray-100 pl-8">
                   <p className="text-gray-600 font-medium italic">"The setup was complete two hours before our guests arrived. Highly professional team."</p>
                   <p className="text-sm font-bold text-gray-900 mt-2">— Sarah K. (Corporate AGM)</p>
                 </div>
              </div>
            </section>

          </div>

          {/* Sidebar / Pricing Tiers (Right) */}
          <aside className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Package Tiers</h2>

            {venue.packages && venue.packages.length > 0 ? (
              venue.packages.map((pkg, index) => (
                <div key={pkg.id} className={`bg-white rounded-3xl p-6 border shadow-sm relative ${index === 0 ? 'border-emerald-500 shadow-[0_8px_30px_rgba(16,185,129,0.1)]' : 'border-gray-100'}`}>
                  {index === 0 && (
                    <div className="absolute top-0 right-6 -translate-y-1/2 bg-emerald-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{pkg.description}</p>
                  <div className="mb-6">
                    <span className="text-3xl font-black text-gray-900">Ksh {Number(pkg.price).toLocaleString()}</span>
                    <span className="text-sm text-gray-500 font-medium"> / day</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-sm text-gray-700 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> {feature}</li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => handleBookNow(pkg.name, Number(pkg.price))}
                    className={`w-full py-3 font-bold rounded-xl transition-colors ${index === 0 ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                  >
                    Select Package
                  </button>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500 shadow-[0_8px_30px_rgba(16,185,129,0.1)] relative">
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-emerald-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
                  Base Booking
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Standard Venue Hire</h3>
                <p className="text-sm text-gray-500 mb-4">Dry hire of the venue grounds.</p>
                <div className="mb-6">
                  <span className="text-3xl font-black text-gray-900">Ksh {basePrice.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 font-medium"> / day</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2 text-sm text-gray-700 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Access to grounds</li>
                  <li className="flex items-start gap-2 text-sm text-gray-700 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Standard amenities</li>
                </ul>
                <button 
                  onClick={() => handleBookNow("Base Package", basePrice)}
                  className="w-full py-3 bg-emerald-50 text-emerald-700 font-bold rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  Select Package
                </button>
              </div>
            )}

          </aside>
        </div>
      </div>
    </div>
  );
};
