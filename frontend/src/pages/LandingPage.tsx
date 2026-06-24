import React from 'react';
import { Link } from 'react-router-dom';
import { Map, ShieldCheck, Star, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white overflow-hidden font-sans">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-12 flex items-center justify-center min-h-[90vh]">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob"></div>
          <div className="absolute top-[20%] right-[-5%] w-[600px] h-[600px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-purple-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-sm font-medium text-emerald-100">Kenya's Premium Venue Marketplace</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 leading-[1.1] drop-shadow-2xl">
            Book the Perfect Space <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
              For Your Next Event.
            </span>
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Discover and book verified venues across the country. From manicured gardens to premium corporate halls, your perfect event starts here.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/explore" 
              className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-full font-bold text-lg hover:bg-emerald-400 transition-all shadow-glow hover:shadow-glow-lg hover:-translate-y-1 w-full sm:w-auto"
            >
              Explore Venues
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/register" 
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white border border-white/10 rounded-full font-bold text-lg hover:bg-white/20 backdrop-blur-md transition-all hover:-translate-y-1 w-full sm:w-auto"
            >
              List Your Venue
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-[#0F172A] relative z-10 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Why Choose Locyfy?</h2>
            <p className="text-gray-400 font-medium max-w-xl mx-auto">We take the hassle out of finding and booking event spaces.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-emerald-400" />}
              title="Verified Spaces"
              description="Every venue is physically verified by our team to ensure it meets our quality standards."
            />
            <FeatureCard 
              icon={<Map className="w-8 h-8 text-blue-400" />}
              title="Wide Selection"
              description="Filter by location, terrain, and event type to find exactly what you're looking for."
            />
            <FeatureCard 
              icon={<Star className="w-8 h-8 text-amber-400" />}
              title="Honest Reviews"
              description="Read reviews from real customers who have booked and hosted events at the venues."
            />
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
                Booking your space <br />
                <span className="text-emerald-400">has never been easier.</span>
              </h2>
              <p className="text-gray-400 text-lg mb-10">
                Skip the endless phone calls and site visits. Locyfy gives you all the information you need upfront.
              </p>

              <div className="space-y-8">
                <StepItem number="01" title="Search & Filter" desc="Find venues based on your specific requirements." />
                <StepItem number="02" title="Compare & Choose" desc="View high-quality photos, pricing, and amenities." />
                <StepItem number="03" title="Book Instantly" desc="Secure your date directly through our platform." />
              </div>
            </div>
            
            <div className="lg:w-1/2 relative w-full">
               <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-[2rem] blur-2xl"></div>
               <div className="bg-[#1E293B] border border-white/10 p-8 rounded-[2rem] relative backdrop-blur-xl shadow-2xl">
                  {/* Mockup UI representation */}
                  <div className="flex gap-4 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-40 bg-gray-800 rounded-xl animate-pulse"></div>
                    <div className="h-6 w-3/4 bg-gray-800 rounded-lg animate-pulse"></div>
                    <div className="flex gap-2">
                       <div className="h-8 w-20 bg-gray-800 rounded-full animate-pulse"></div>
                       <div className="h-8 w-20 bg-gray-800 rounded-full animate-pulse"></div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Footer Section */}
      <div className="relative py-24 bg-emerald-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 to-transparent"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to host your event?</h2>
          <p className="text-emerald-100 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of event planners who trust Locyfy to find the perfect venue.
          </p>
          <Link 
            to="/explore" 
            className="inline-flex items-center justify-center px-10 py-5 bg-white text-emerald-900 rounded-full font-black text-xl hover:bg-gray-100 transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            Start Exploring Now
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors">
    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </div>
);

const StepItem = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
  <div className="flex gap-6 group">
    <div className="flex-shrink-0 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center font-bold text-gray-400 group-hover:border-emerald-500 group-hover:text-emerald-400 transition-colors">
      {number}
    </div>
    <div>
      <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
      <p className="text-gray-400">{desc}</p>
    </div>
  </div>
);
