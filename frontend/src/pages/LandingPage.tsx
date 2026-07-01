import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Map, ShieldCheck, Star, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import type { Variants } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Smooth out the scroll progress
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });

  // Floating Hero Elements Parallax
  const yHero1 = useTransform(smoothProgress, [0, 1], [0, -400]);
  const yHero2 = useTransform(smoothProgress, [0, 1], [0, -600]);
  const yHero3 = useTransform(smoothProgress, [0, 1], [0, -200]);

  // Framer Motion Variants for Text Reveal
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const textItemVariants: Variants = {
    hidden: { opacity: 0, y: 100, rotateX: 90, filter: 'blur(20px)', scale: 0.8 },
    show: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: { type: "spring", stiffness: 150, damping: 15, mass: 1.5 }
    },
  };

  const imageRevealVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5, y: 200, rotate: -20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotate: 0,
      transition: { type: "spring", stiffness: 60, damping: 20, delay: 0.6, mass: 2 }
    }
  };

  return (
    <div ref={containerRef} className="bg-[#050505] text-white font-sans overflow-x-hidden relative min-h-screen">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/20 rounded-[100%] blur-[120px] pointer-events-none -z-10 mix-blend-screen opacity-60"></div>

      {/* --- HERO SECTION --- */}
      <div className="min-h-screen relative flex flex-col items-center justify-center px-6 pt-32 pb-20 z-10 overflow-hidden">
        
        {/* Floating Images (Jitter Style) */}
        <motion.div style={{ y: yHero1 }} className="absolute left-[5%] md:left-[10%] top-[20%] w-48 h-64 md:w-64 md:h-80 rounded-3xl overflow-hidden border border-white/10 hidden md:block z-0 shadow-2xl">
           <motion.img 
             variants={imageRevealVariants} initial="hidden" animate="show"
             src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600" 
             className="w-full h-full object-cover" alt="Venue Left" 
           />
        </motion.div>

        <motion.div style={{ y: yHero2 }} className="absolute right-[5%] md:right-[10%] top-[30%] w-56 h-72 md:w-72 md:h-96 rounded-3xl overflow-hidden border border-white/10 hidden md:block z-0 shadow-2xl">
           <motion.img 
             variants={imageRevealVariants} initial="hidden" animate="show"
             src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600" 
             className="w-full h-full object-cover" alt="Venue Right" 
           />
        </motion.div>

        <motion.div style={{ y: yHero3 }} className="absolute left-[20%] bottom-[-10%] w-40 h-56 rounded-3xl overflow-hidden border border-white/10 hidden lg:block z-0 shadow-2xl">
           <motion.img 
             variants={imageRevealVariants} initial="hidden" animate="show"
             src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600" 
             className="w-full h-full object-cover" alt="Venue Bottom" 
           />
        </motion.div>

        {/* Hero Text */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="text-center max-w-5xl mx-auto relative z-10 mt-10"
        >
          <motion.div variants={textItemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-bold tracking-widest uppercase text-emerald-400">Locyfy Premium</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 text-white leading-[0.9]">
            <motion.div variants={textItemVariants} className="block">Discover</motion.div>
            <motion.div variants={textItemVariants} className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-white">
              Exceptional
            </motion.div>
            <motion.div variants={textItemVariants} className="block">Spaces.</motion.div>
          </h1>
          
          <motion.p variants={textItemVariants} className="text-gray-400 text-lg md:text-2xl max-w-2xl mx-auto font-medium mb-12">
            Immersive environments for unforgettable experiences. Book verified premium venues effortlessly.
          </motion.p>

          <motion.div variants={textItemVariants}>
            <Link 
              to="/explore" 
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-emerald-500 text-white rounded-full font-black text-lg hover:bg-emerald-400 transition-all hover:scale-105 shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)]"
            >
              Start Exploring <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* --- MARQUEE SECTION --- */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        className="py-6 bg-emerald-500 overflow-hidden relative flex whitespace-nowrap border-y border-white/10 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] z-20"
      >
        <motion.div 
          animate={{ x: [0, -1035] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
          className="flex items-center text-black font-black text-2xl uppercase tracking-widest"
        >
          {Array(10).fill(0).map((_, i) => (
            <React.Fragment key={i}>
              <span className="mx-6">Premium Venues</span>
              <span className="mx-6 text-emerald-900">•</span>
              <span className="mx-6">Secure Escrow</span>
              <span className="mx-6 text-emerald-900">•</span>
              <span className="mx-6">Locyfy Verified</span>
              <span className="mx-6 text-emerald-900">•</span>
            </React.Fragment>
          ))}
        </motion.div>
      </motion.div>

      {/* --- FEATURES SECTION --- */}
      <div className="py-32 relative bg-[#050505] z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 120 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white">Engineering <span className="text-emerald-400">Trust.</span></h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto font-medium">Our platform isn't just beautiful. It's built with security, verification, and reliability at its core.</p>
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

      {/* --- FOOTER CTA --- */}
      <div className="py-40 relative overflow-hidden bg-[#0a0a0a] border-t border-white/5 z-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 150 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
          className="max-w-4xl mx-auto px-6 text-center relative z-10"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-lg bg-emerald-500/20 blur-[120px] rounded-full -z-10"></div>
          
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-10 leading-tight">
            Ready to <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">host?</span>
          </h2>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/explore" 
              className="inline-flex items-center justify-center px-12 py-5 bg-white text-black rounded-full font-black text-xl hover:bg-gray-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              Enter Application
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 150 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ type: "spring", stiffness: 80, damping: 20, delay }}
    whileHover={{ y: -10, scale: 1.02 }}
    className="bg-white/[0.02] border border-white/5 p-10 rounded-[2rem] hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all duration-300 group relative overflow-hidden backdrop-blur-sm"
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-white/10">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{title}</h3>
    <p className="text-gray-400 leading-relaxed text-base font-medium">{description}</p>
  </motion.div>
);
