import React from 'react';
import { Star, ShieldCheck, CheckCircle2, PlayCircle, MapPin, Check } from 'lucide-react';

export const VendorProfile: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Cover Image & Header */}
      <div className="relative h-72 md:h-96 w-full">
        <img 
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1920" 
          alt="Vendor Cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-24 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-extrabold text-gray-900">Karura Forest Event Grounds</h1>
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-gray-500 flex items-center gap-2 font-medium">
              <MapPin className="w-4 h-4 text-gray-400" />
              Limuru Road, Gigiri, Nairobi
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
            <button className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-lg">
              Book Now
            </button>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Media Gallery */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Media Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="col-span-2 md:col-span-2 row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer">
                  <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Event" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <PlayCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden"><img src="https://images.unsplash.com/photo-1505236858219-8359eb29e325?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover hover:scale-105 transition-transform" /></div>
                <div className="rounded-2xl overflow-hidden"><img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover hover:scale-105 transition-transform" /></div>
              </div>
            </section>

            {/* Reviews Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Punctuality & Reliability</h2>
              
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-6 flex gap-8 items-center">
                 <div className="text-center">
                   <p className="text-4xl font-black text-emerald-500">98%</p>
                   <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">On Time Setup</p>
                 </div>
                 <div className="flex-grow border-l border-gray-100 pl-8">
                   <p className="text-gray-600 font-medium italic">"The setup was complete two hours before our guests arrived. Highly professional team."</p>
                   <p className="text-sm font-bold text-gray-900 mt-2">— Sarah K. (Corporate AGM)</p>
                 </div>
              </div>

              <div className="space-y-4">
                {[1,2].map(i => (
                  <div key={i} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">M</div>
                        <div>
                          <p className="font-bold text-gray-900">Mercy Njeri</p>
                          <p className="text-xs text-gray-500">Ruracio Event • Oct 2025</p>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mt-3 leading-relaxed">Absolutely stunning location. The management ensured the backup generator was on standby, and the catering was incredible. Made our day very special.</p>
                  </div>
                ))}
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
              <h3 className="text-xl font-bold text-gray-900 mb-1">Traditional / Ruracio Package</h3>
              <p className="text-sm text-gray-500 mb-4">Perfect for large family gatherings.</p>
              <div className="mb-6">
                <span className="text-3xl font-black text-gray-900">Ksh 150,000</span>
                <span className="text-sm text-gray-500 font-medium"> / day</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-gray-700 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Large manicured grounds (up to 300 pax)</li>
                <li className="flex items-start gap-2 text-sm text-gray-700 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> 2 VIP Holding Tents</li>
                <li className="flex items-start gap-2 text-sm text-gray-700 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Local Decor inclusive (Kitenge motifs)</li>
              </ul>
              <button className="w-full py-3 bg-emerald-50 text-emerald-700 font-bold rounded-xl hover:bg-emerald-100 transition-colors">Select Package</button>
            </div>

            {/* Corporate Package */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Corporate AGM Package</h3>
              <p className="text-sm text-gray-500 mb-4">Streamlined for professional events.</p>
              <div className="mb-6">
                <span className="text-3xl font-black text-gray-900">Ksh 250,000</span>
                <span className="text-sm text-gray-500 font-medium"> / day</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-gray-600"><Check className="w-5 h-5 text-gray-400 shrink-0" /> PA System & Dual Projectors</li>
                <li className="flex items-start gap-2 text-sm text-gray-600"><Check className="w-5 h-5 text-gray-400 shrink-0" /> High-speed WiFi</li>
                <li className="flex items-start gap-2 text-sm text-gray-600"><Check className="w-5 h-5 text-gray-400 shrink-0" /> Coffee/Tea breaks included</li>
              </ul>
              <button className="w-full py-3 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">Select Package</button>
            </div>

            {/* Koroga Package */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Intimate Koroga</h3>
              <p className="text-sm text-gray-500 mb-4">Self-catering options.</p>
              <div className="mb-6">
                <span className="text-3xl font-black text-gray-900">Ksh 45,000</span>
                <span className="text-sm text-gray-500 font-medium"> / day</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-gray-600"><Check className="w-5 h-5 text-gray-400 shrink-0" /> Grills & Jikos provided</li>
                <li className="flex items-start gap-2 text-sm text-gray-600"><Check className="w-5 h-5 text-gray-400 shrink-0" /> Seating for 30 pax</li>
              </ul>
              <button className="w-full py-3 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">Select Package</button>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};
