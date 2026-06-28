import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, CheckCircle2, PlayCircle, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import apiClient from '../../services/apiClient';
import type { Venue } from '../../types/venue';

export const VenueDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");

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

  useEffect(() => {
    if (venue?.locations && venue.locations.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedLocationId(venue.locations[0].id);
    }
  }, [venue]);

  const handleBookNow = (packageType: string, calculatedPrice: number) => {
    if (!venue) return;
    if (!selectedLocationId) {
      alert("Please select a branch location.");
      return;
    }
    
    navigate('/checkout', {
      state: {
        venueId: venue.id,
        locationId: selectedLocationId,
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

  const slideUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Cover Image & Header - Parallax Effect */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-96 md:h-[32rem] w-full sticky top-0 -z-10"
      >
        <img 
          src={venue.imageUrl || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1920"} 
          alt={venue.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-32 relative z-10">
        <motion.div 
          initial="hidden"
          animate="show"
          variants={slideUp}
          className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">{venue.name}</h1>
              {venue.isLocyfyVerified && <ShieldCheck className="w-8 h-8 text-emerald-500 drop-shadow-sm" />}
            </div>
            
            {venue.locations && venue.locations.length > 0 ? (
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <select 
                  value={selectedLocationId} 
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-700 py-1.5 px-3 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm transition-shadow hover:shadow-sm"
                >
                  {venue.locations.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.subCounty}, {loc.county} ({loc.terrain})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
               <p className="text-red-500 font-bold text-sm">No locations available.</p>
            )}
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
              <span className="text-sm font-black text-gray-900 tracking-wider">4.8 (124 Reviews)</span>
            </div>
            <button 
              onClick={() => {
                if (venue.packages && venue.packages.length > 0) {
                  handleBookNow(venue.packages[0].name, Number(venue.packages[0].price));
                } else {
                  handleBookNow("Base Package", basePrice);
                }
              }}
              className="px-8 py-4 bg-gray-900 text-white font-black tracking-wide rounded-2xl hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              BOOK NOW
            </button>
          </div>
        </motion.div>

        {/* Two-Column Layout */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Description & Amenities */}
            <motion.section 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideUp}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Venue</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {venue.description || "A beautiful, premium event space perfect for your next gathering. Verified by Locyfy to ensure top-tier quality and reliability."}
              </p>

              <h3 className="text-lg font-bold text-gray-900 mb-4">Key Amenities</h3>
              <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 {(venue.amenities && venue.amenities.length > 0) ? venue.amenities.map((amenity: unknown, idx) => (
                    <motion.div variants={slideUp} key={idx} className="flex items-center gap-2 text-gray-700 font-medium bg-white border border-gray-100 shadow-sm p-3 rounded-xl text-sm hover:shadow-md transition-shadow">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {typeof amenity === 'string' ? amenity : (amenity as {name: string}).name}
                    </motion.div>
                 )) : (
                    <motion.div variants={slideUp} className="flex items-center gap-2 text-gray-700 font-medium bg-white border border-gray-100 shadow-sm p-3 rounded-xl text-sm hover:shadow-md transition-shadow">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Standard Amenities Included
                    </motion.div>
                 )}
                 <motion.div variants={slideUp} className="flex items-center gap-2 text-gray-700 font-medium bg-white border border-gray-100 shadow-sm p-3 rounded-xl text-sm hover:shadow-md transition-shadow">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Max Capacity: {venue.capacity} Pax
                 </motion.div>
              </motion.div>
            </motion.section>

            {/* Media Gallery */}
            <motion.section 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideUp}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Media Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="col-span-2 md:col-span-2 row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer bg-gray-200 shadow-sm hover:shadow-xl transition-shadow">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                    src={venue.imageUrl || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"} 
                    className="w-full h-full object-cover" 
                    alt="Event Primary" 
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                     <PlayCircle className="w-12 h-12 text-white drop-shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300" />
                  </div>
                </div>
                {venue.images && venue.images.length > 0 ? (
                  venue.images.map((img) => (
                    <div key={img.id} className="rounded-2xl overflow-hidden bg-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <motion.img 
                        whileHover={{ scale: 1.1, rotate: 2 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        src={img.image_url} 
                        className="w-full h-full object-cover" 
                        alt="Gallery item" 
                      />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="rounded-2xl overflow-hidden bg-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <motion.img whileHover={{ scale: 1.1, rotate: 2 }} transition={{ duration: 0.5, type: "spring" }} src="https://images.unsplash.com/photo-1505236858219-8359eb29e325?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Placeholder 1" />
                    </div>
                    <div className="rounded-2xl overflow-hidden bg-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <motion.img whileHover={{ scale: 1.1, rotate: -2 }} transition={{ duration: 0.5, type: "spring" }} src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Placeholder 2" />
                    </div>
                  </>
                )}
              </div>
            </motion.section>

            {/* Reviews Section */}
            <motion.section 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideUp}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Punctuality & Reliability</h2>
              
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow mb-6 flex gap-8 items-center">
                 <div className="text-center">
                   <p className="text-4xl font-black text-emerald-500">{venue.mlRecommendationScore || 95}%</p>
                   <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">Locyfy Score</p>
                 </div>
                 <div className="flex-grow border-l border-gray-100 pl-8">
                   <p className="text-gray-600 font-medium italic text-lg leading-relaxed">"The setup was complete two hours before our guests arrived. Highly professional team."</p>
                   <p className="text-sm font-bold text-gray-900 mt-3">— Sarah K. <span className="text-gray-400 font-normal">(Corporate AGM)</span></p>
                 </div>
              </div>
            </motion.section>

          </div>

          {/* Sidebar / Pricing Tiers (Right) */}
          <aside className="space-y-6 lg:sticky lg:top-32 h-fit">
            <motion.h2 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl font-black text-gray-900 mb-6 tracking-tight"
            >
              Package Tiers
            </motion.h2>

            <motion.div 
              initial="hidden"
              animate="show"
              variants={staggerContainer}
            >
              {venue.packages && venue.packages.length > 0 ? (
                venue.packages.map((pkg, index) => (
                  <motion.div 
                    variants={slideUp}
                    key={pkg.id} 
                    className={`bg-white rounded-3xl p-6 border relative mb-6 transition-all duration-300 hover:-translate-y-1 ${index === 0 ? 'border-emerald-500 shadow-[0_8px_30px_rgba(16,185,129,0.15)]' : 'border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'}`}
                  >
                    {index === 0 && (
                      <div className="absolute top-0 right-6 -translate-y-1/2 bg-emerald-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
                        Most Popular
                      </div>
                    )}
                    <h3 className="text-xl font-black text-gray-900 mb-1 tracking-tight">{pkg.name}</h3>
                    <p className="text-sm text-gray-500 mb-4 font-medium">{pkg.description}</p>
                    <div className="mb-6">
                      <span className="text-3xl font-black text-gray-900 tracking-tight">Ksh {Number(pkg.price).toLocaleString()}</span>
                      <span className="text-xs text-gray-400 font-black uppercase tracking-widest"> / day</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3 text-sm text-gray-600 font-semibold"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> {feature}</li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => handleBookNow(pkg.name, Number(pkg.price))}
                      className={`w-full py-4 font-black tracking-wide rounded-2xl transition-all active:scale-95 ${index === 0 ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 shadow-sm' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                    >
                      SELECT PACKAGE
                    </button>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  variants={slideUp}
                  className="bg-white rounded-3xl p-6 border-2 border-emerald-500 shadow-[0_8px_30px_rgba(16,185,129,0.15)] relative transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-6 -translate-y-1/2 bg-emerald-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
                    Base Booking
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-1 tracking-tight">Standard Venue Hire</h3>
                  <p className="text-sm text-gray-500 mb-4 font-medium">Dry hire of the venue grounds.</p>
                  <div className="mb-6">
                    <span className="text-3xl font-black text-gray-900 tracking-tight">Ksh {basePrice.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 font-black uppercase tracking-widest"> / day</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3 text-sm text-gray-600 font-semibold"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Access to grounds</li>
                    <li className="flex items-start gap-3 text-sm text-gray-600 font-semibold"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Standard amenities</li>
                  </ul>
                  <button 
                    onClick={() => handleBookNow("Base Package", basePrice)}
                    className="w-full py-4 bg-emerald-50 text-emerald-700 font-black tracking-wide rounded-2xl hover:bg-emerald-100 transition-all hover:-translate-y-0.5 active:scale-95 shadow-sm"
                  >
                    SELECT PACKAGE
                  </button>
                </motion.div>
              )}
            </motion.div>

          </aside>
        </div>
      </div>
    </div>
  );
};
