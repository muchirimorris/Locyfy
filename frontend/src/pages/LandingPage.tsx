import React from 'react';
import { Link } from 'react-router-dom';
import { Map, ShieldCheck, Star, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export const LandingPage: React.FC = () => {
  // Track scroll progress of the ENTIRE page
  const { scrollYProgress } = useScroll();

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });

  // --- 3D Background Transforms tied to Global Scroll ---
  
  // Card 1 (Center Base) - Drifts up and fades slightly
  const card1Y = useTransform(smoothProgress, [0, 1], [0, -300]);
  const card1Z = useTransform(smoothProgress, [0, 1], [-100, -500]);
  const card1RotateX = useTransform(smoothProgress, [0, 1], [10, 40]);
  const card1RotateZ = useTransform(smoothProgress, [0, 1], [-5, -15]);
  const card1Opacity = useTransform(smoothProgress, [0, 0.5, 1], [0.5, 0.2, 0]);

  // Card 2 (Left) - Drifts left and rotates
  const card2X = useTransform(smoothProgress, [0, 1], [-200, -600]);
  const card2Y = useTransform(smoothProgress, [0, 1], [50, -100]);
  const card2Z = useTransform(smoothProgress, [0, 1], [-200, -400]);
  const card2RotateZ = useTransform(smoothProgress, [0, 1], [-10, -30]);
  const card2RotateY = useTransform(smoothProgress, [0, 1], [20, 60]);
  const card2Opacity = useTransform(smoothProgress, [0, 0.5, 1], [0.4, 0.15, 0]);

  // Card 3 (Right) - Drifts right and rotates
  const card3X = useTransform(smoothProgress, [0, 1], [200, 600]);
  const card3Y = useTransform(smoothProgress, [0, 1], [50, -100]);
  const card3Z = useTransform(smoothProgress, [0, 1], [-200, -400]);
  const card3RotateZ = useTransform(smoothProgress, [0, 1], [10, 30]);
  const card3RotateY = useTransform(smoothProgress, [0, 1], [-20, -60]);
  const card3Opacity = useTransform(smoothProgress, [0, 0.5, 1], [0.4, 0.15, 0]);

  // Card 4 (Far Left)
  const card4X = useTransform(smoothProgress, [0, 1], [-400, -800]);
  const card4Y = useTransform(smoothProgress, [0, 1], [100, -50]);
  const card4Z = useTransform(smoothProgress, [0, 1], [-300, -500]);
  const card4RotateZ = useTransform(smoothProgress, [0, 1], [-15, -45]);
  const card4RotateY = useTransform(smoothProgress, [0, 1], [30, 80]);
  const card4Opacity = useTransform(smoothProgress, [0, 0.5, 1], [0.3, 0.1, 0]);

  // Card 5 (Far Right)
  const card5X = useTransform(smoothProgress, [0, 1], [400, 800]);
  const card5Y = useTransform(smoothProgress, [0, 1], [100, -50]);
  const card5Z = useTransform(smoothProgress, [0, 1], [-300, -500]);
  const card5RotateZ = useTransform(smoothProgress, [0, 1], [15, 45]);
  const card5RotateY = useTransform(smoothProgress, [0, 1], [-30, -80]);
  const card5Opacity = useTransform(smoothProgress, [0, 0.5, 1], [0.3, 0.1, 0]);

  // General Background Blur
  const bgBlur = useTransform(smoothProgress, [0, 0.5], ["blur(0px)", "blur(10px)"]);

  return (
    <div className="bg-[#050505] text-white font-sans overflow-x-hidden relative min-h-screen">
      {/* Top Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 origin-left z-[100]" 
        style={{ scaleX: scrollYProgress }} 
      />

      {/* --- FIXED 3D BACKGROUND LAYER --- */}
      <motion.div 
        style={{ filter: bgBlur }}
        className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center perspective-[1000px] overflow-hidden"
      >
        <div className="absolute inset-0 bg-noise opacity-[0.03] z-10"></div>
        <div className="absolute inset-0 bg-[#050505]/60 z-10"></div> {/* Dark wash to make text readable */}
        
        {/* Ambient Center Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px] mix-blend-screen z-0" />

        <div className="relative w-full h-full flex items-center justify-center transform-style-3d z-0 mt-32">
          {/* Far Left Card */}
          <motion.div 
            style={{ x: card4X, y: card4Y, rotateZ: card4RotateZ, rotateY: card4RotateY, z: card4Z, opacity: card4Opacity }}
            className="absolute w-[220px] h-[320px] rounded-3xl overflow-hidden border border-white/5"
          >
            <img src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="Venue" />
          </motion.div>

          {/* Far Right Card */}
          <motion.div 
            style={{ x: card5X, y: card5Y, rotateZ: card5RotateZ, rotateY: card5RotateY, z: card5Z, opacity: card5Opacity }}
            className="absolute w-[220px] h-[320px] rounded-3xl overflow-hidden border border-white/5"
          >
            <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="Venue" />
          </motion.div>

          {/* Left Card */}
          <motion.div 
            style={{ x: card2X, y: card2Y, rotateZ: card2RotateZ, rotateY: card2RotateY, z: card2Z, opacity: card2Opacity }}
            className="absolute w-[260px] h-[380px] rounded-3xl overflow-hidden border border-white/10"
          >
            <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="Venue" />
          </motion.div>

          {/* Right Card */}
          <motion.div 
            style={{ x: card3X, y: card3Y, rotateZ: card3RotateZ, rotateY: card3RotateY, z: card3Z, opacity: card3Opacity }}
            className="absolute w-[260px] h-[380px] rounded-3xl overflow-hidden border border-white/10"
          >
            <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="Venue" />
          </motion.div>

          {/* Center Main Card */}
          <motion.div 
            style={{ y: card1Y, z: card1Z, rotateX: card1RotateX, rotateZ: card1RotateZ, opacity: card1Opacity }}
            className="absolute w-[300px] h-[440px] rounded-[2rem] overflow-hidden border border-emerald-500/20"
          >
            <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Main Venue" />
          </motion.div>
        </div>
      </motion.div>


      {/* --- FOREGROUND SCROLLING CONTENT --- */}
      <div className="relative z-10 w-full">
        
        {/* Hero Section */}
        <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 pt-32 pb-20">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-medium text-gray-300">Premium Event Venues</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              className="text-6xl md:text-8xl lg:text-9xl font-medium tracking-tight mb-6 text-white drop-shadow-2xl"
            >
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Space.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-300 text-lg md:text-2xl max-w-2xl mx-auto font-medium drop-shadow-lg mb-10"
            >
              Immersive environments for unforgettable experiences.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link 
                to="/explore" 
                className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              >
                Enter Platform <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Marquee Section */}
        <div className="py-6 bg-emerald-500 overflow-hidden relative flex whitespace-nowrap border-y border-white/10 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
          <motion.div 
            animate={{ x: [0, -1035] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
            className="flex items-center text-black font-black text-2xl uppercase tracking-widest"
          >
            {Array(10).fill(0).map((_, i) => (
              <React.Fragment key={i}>
                <span className="mx-6">Immersive Experience</span>
                <span className="mx-6 text-emerald-900">•</span>
                <span className="mx-6">Secure Escrow</span>
                <span className="mx-6 text-emerald-900">•</span>
                <span className="mx-6">Locyfy Verified</span>
                <span className="mx-6 text-emerald-900">•</span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* Spacer to allow scrolling over the background before hitting features */}
        <div className="h-[60vh] w-full" />

        {/* Features Section */}
        <div className="py-32 relative bg-zinc-950/80 backdrop-blur-xl border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-6 text-white">Engineering Trust.</h2>
              <p className="text-gray-400 text-xl max-w-2xl mx-auto">Our platform isn't just beautiful. It's built with security, verification, and reliability at its core.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<ShieldCheck className="w-8 h-8 text-emerald-400" />}
                title="Verified Spaces"
                description="Every venue is physically verified by our team to ensure it meets our rigorous quality and safety standards."
                delay={0}
              />
              <FeatureCard 
                icon={<Map className="w-8 h-8 text-emerald-400" />}
                title="Wide Selection"
                description="Filter by location, terrain, and event type to find exactly what you're looking for, from rooftops to forests."
                delay={0.2}
              />
              <FeatureCard 
                icon={<Star className="w-8 h-8 text-emerald-400" />}
                title="Honest Reviews"
                description="Read reviews from real customers who have booked and hosted successful events at these premium venues."
                delay={0.4}
              />
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="py-32 relative overflow-hidden bg-[#050505]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, type: "spring" }}
            style={{ transformPerspective: 1000 }}
            className="max-w-4xl mx-auto px-6 text-center relative z-10"
          >
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-emerald-500 blur-[150px] rounded-full -z-10 pointer-events-none"
            />
            <h2 className="text-5xl md:text-7xl font-medium tracking-tight text-white mb-8">Ready to host?</h2>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/explore" 
                className="inline-flex items-center justify-center px-12 py-5 bg-white text-black rounded-xl font-bold text-xl hover:bg-gray-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.1)]"
              >
                Enter Application
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ type: "spring", bounce: 0.4, delay }}
    whileHover={{ y: -10, scale: 1.02 }}
    className="bg-zinc-900/40 border border-white/5 p-10 rounded-[2rem] hover:bg-zinc-800/60 hover:border-white/10 transition-colors group relative overflow-hidden"
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
    <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-inner">
      {icon}
    </div>
    <h3 className="text-2xl font-medium text-white mb-4">{title}</h3>
    <p className="text-gray-400 leading-relaxed text-base font-medium">{description}</p>
  </motion.div>
);
