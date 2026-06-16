import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, CheckCircle2, PlayCircle, MapPin, Check, Loader2 } from 'lucide-react';
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

  const handleBookNow = (packageType: string, priceMultiplier: number) => {
    if (!venue) return;
    
    const calculatedPrice = Number(venue.pricePerDay) * priceMultiplier;
    
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

  // Calculate pricing tiers mathematically for the MVP
  const basePrice = Number(venue.pricePerDay);
  const korogaPrice = basePrice * 0.3; // 30% of base
  const corporatePrice = basePrice * 1.5; // 150% of base

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
              onClick={() => handleBookNow("Traditional / Ruracio Package", 1.0)}
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
                  <img src={venue.imageUrl || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Event" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <PlayCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden bg-gray-200"><img src="https://images.unsplash.com/photo-1505236858219-8359eb29e325?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover hover:scale-105 transition-transform" /></div>
                <div className="rounded-2xl overflow-hidden bg-gray-200"><img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover hover:scale-105 transition-transform" /></div>
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

            {/* Ruracio Package */}
            <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500 shadow-[0_8px_30px_rgba(16,185,129,0.1)] relative">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-emerald-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Traditional / Ruracio</h3>
              <p className="text-sm text-gray-500 mb-4">Perfect for large family gatherings.</p>
              <div className="mb-6">
                <span className="text-3xl font-black text-gray-900">Ksh {basePrice.toLocaleString()}</span>
                <span className="text-sm text-gray-500 font-medium"> / day</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-gray-700 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Large grounds (up to {venue.capacity} pax)</li>
                <li className="flex items-start gap-2 text-sm text-gray-700 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> 2 VIP Holding Tents</li>
                <li className="flex items-start gap-2 text-sm text-gray-700 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Local Decor inclusive</li>
              </ul>
              <button 
                onClick={() => handleBookNow("Traditional / Ruracio Package", 1.0)}
                className="w-full py-3 bg-emerald-50 text-emerald-700 font-bold rounded-xl hover:bg-emerald-100 transition-colors"
              >
                Select Package
              </button>
            </div>

            {/* Corporate Package */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Corporate AGM</h3>
              <p className="text-sm text-gray-500 mb-4">Streamlined for professional events.</p>
              <div className="mb-6">
                <span className="text-3xl font-black text-gray-900">Ksh {corporatePrice.toLocaleString()}</span>
                <span className="text-sm text-gray-500 font-medium"> / day</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-gray-600"><Check className="w-5 h-5 text-gray-400 shrink-0" /> PA System & Projectors</li>
                <li className="flex items-start gap-2 text-sm text-gray-600"><Check className="w-5 h-5 text-gray-400 shrink-0" /> High-speed WiFi</li>
                <li className="flex items-start gap-2 text-sm text-gray-600"><Check className="w-5 h-5 text-gray-400 shrink-0" /> Coffee/Tea breaks included</li>
              </ul>
              <button 
                onClick={() => handleBookNow("Corporate AGM", 1.5)}
                className="w-full py-3 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Select Package
              </button>
            </div>

            {/* Koroga Package */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Intimate Koroga</h3>
              <p className="text-sm text-gray-500 mb-4">Self-catering options.</p>
              <div className="mb-6">
                <span className="text-3xl font-black text-gray-900">Ksh {korogaPrice.toLocaleString()}</span>
                <span className="text-sm text-gray-500 font-medium"> / day</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-gray-600"><Check className="w-5 h-5 text-gray-400 shrink-0" /> Grills & Jikos provided</li>
                <li className="flex items-start gap-2 text-sm text-gray-600"><Check className="w-5 h-5 text-gray-400 shrink-0" /> Seating for 30 pax</li>
              </ul>
              <button 
                onClick={() => handleBookNow("Intimate Koroga", 0.3)}
                className="w-full py-3 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Select Package
              </button>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};
