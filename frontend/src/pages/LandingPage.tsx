import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Map, ShieldCheck, Star, ArrowRight, UserCircle, Settings, Store, Sparkles } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden font-sans relative">
      {/* Noise Background Overlay */}
      <div className="fixed inset-0 bg-noise opacity-[0.03] pointer-events-none z-0"></div>
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-12 flex flex-col items-center min-h-screen z-10">
        
        {/* Floating Icons (Orbiting the text) */}
        <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto hidden md:block">
          {/* Top Left */}
          <div className="absolute top-[20%] left-[15%] p-4 bg-zinc-900/80 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md animate-float" style={{ animationDelay: '0s' }}>
            <UserCircle className="w-8 h-8 text-emerald-400" />
          </div>
          {/* Bottom Left */}
          <div className="absolute top-[60%] left-[10%] p-4 bg-zinc-900/80 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md animate-float" style={{ animationDelay: '2s' }}>
            <Settings className="w-8 h-8 text-blue-400" />
          </div>
          {/* Top Right */}
          <div className="absolute top-[15%] right-[15%] p-4 bg-zinc-900/80 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md animate-float" style={{ animationDelay: '1s' }}>
            <Store className="w-8 h-8 text-purple-400" />
          </div>
          {/* Bottom Right */}
          <div className="absolute top-[65%] right-[10%] p-4 bg-zinc-900/80 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md animate-float" style={{ animationDelay: '3s' }}>
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>
        </div>

        {/* Main Typography */}
        <div className="max-w-4xl mx-auto relative z-20 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-300">Distribution First. Management Included.</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-6 leading-[1.1] text-white">
            Events reimagined for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-emerald-400">
              Kenya.
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Get your events in front of the right audience. We connect organizers with active event-goers looking for experiences like yours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/explore" 
              className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-lg font-medium text-lg hover:bg-emerald-400 transition-all shadow-glow hover:shadow-glow-lg hover:-translate-y-1 w-full sm:w-auto"
            >
              Explore Events
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/register" 
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white border border-white/10 rounded-lg font-medium text-lg hover:bg-white/10 backdrop-blur-md transition-all hover:-translate-y-1 w-full sm:w-auto"
            >
              Organize an Event
            </Link>
          </div>
        </div>

        {/* Fanning Art Gallery Section */}
        <div className="relative h-[300px] sm:h-[400px] w-full max-w-5xl mx-auto mt-20 md:mt-32 flex justify-center items-center perspective-1000">
          
          {/* Card 1 */}
          <div 
            className="absolute z-10 transition-all duration-1000 ease-out cursor-pointer hover:z-50 hover:scale-110"
            style={{ 
              transform: mounted ? 'translateX(-200px) translateY(40px) scale(0.85) rotate(-10deg)' : 'translateX(0) translateY(100px) scale(0.5) opacity(0)' 
            }}
          >
            <div className="w-[120px] sm:w-[160px] h-[180px] sm:h-[240px] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/10 bg-zinc-900">
              <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-80" alt="Event" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          </div>

          {/* Card 2 */}
          <div 
            className="absolute z-20 transition-all duration-1000 ease-out delay-75 cursor-pointer hover:z-50 hover:scale-110"
            style={{ 
              transform: mounted ? 'translateX(-100px) translateY(20px) scale(0.9) rotate(-5deg)' : 'translateX(0) translateY(100px) scale(0.5) opacity(0)' 
            }}
          >
            <div className="w-[120px] sm:w-[160px] h-[180px] sm:h-[240px] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/10 bg-zinc-900">
              <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-80" alt="Event" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          </div>

          {/* Card 3 (Center) */}
          <div 
            className="absolute z-30 transition-all duration-1000 ease-out delay-150 cursor-pointer hover:z-50 hover:scale-110 hover:-translate-y-4"
            style={{ 
              transform: mounted ? 'translateX(0px) translateY(0px) scale(1) rotate(0deg)' : 'translateX(0) translateY(100px) scale(0.5) opacity(0)' 
            }}
          >
            <div className="w-[140px] sm:w-[180px] h-[200px] sm:h-[260px] rounded-2xl sm:rounded-3xl shadow-2xl shadow-emerald-500/20 overflow-hidden border border-white/20 bg-zinc-900">
              <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-90" alt="Event" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-sm">Neon Nights</h3>
                <p className="text-emerald-400 text-xs">Nairobi</p>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div 
            className="absolute z-20 transition-all duration-1000 ease-out delay-75 cursor-pointer hover:z-50 hover:scale-110"
            style={{ 
              transform: mounted ? 'translateX(100px) translateY(20px) scale(0.9) rotate(5deg)' : 'translateX(0) translateY(100px) scale(0.5) opacity(0)' 
            }}
          >
            <div className="w-[120px] sm:w-[160px] h-[180px] sm:h-[240px] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/10 bg-zinc-900">
              <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-80" alt="Event" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          </div>

          {/* Card 5 */}
          <div 
            className="absolute z-10 transition-all duration-1000 ease-out cursor-pointer hover:z-50 hover:scale-110"
            style={{ 
              transform: mounted ? 'translateX(200px) translateY(40px) scale(0.85) rotate(10deg)' : 'translateX(0) translateY(100px) scale(0.5) opacity(0)' 
            }}
          >
            <div className="w-[120px] sm:w-[160px] h-[180px] sm:h-[240px] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/10 bg-zinc-900">
              <img src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-80" alt="Event" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          </div>

        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 relative z-10 border-y border-white/5 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4">Why Choose Locyfy?</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">We take the hassle out of finding and booking event spaces.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-emerald-400" />}
              title="Verified Spaces"
              description="Every venue is physically verified by our team to ensure it meets our quality standards."
            />
            <FeatureCard 
              icon={<Map className="w-6 h-6 text-emerald-400" />}
              title="Wide Selection"
              description="Filter by location, terrain, and event type to find exactly what you're looking for."
            />
            <FeatureCard 
              icon={<Star className="w-6 h-6 text-emerald-400" />}
              title="Honest Reviews"
              description="Read reviews from real customers who have booked and hosted events at the venues."
            />
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="py-24 relative z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-6">Ready to host your event?</h2>
          <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of event planners who trust Locyfy to find the perfect venue.
          </p>
          <Link 
            to="/explore" 
            className="inline-flex items-center justify-center px-10 py-4 bg-white text-black rounded-lg font-medium text-lg hover:bg-gray-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
          >
            Start Exploring Now
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-2xl hover:bg-zinc-800/50 hover:border-white/10 transition-all duration-300 group">
    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-medium text-white mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
  </div>
);
