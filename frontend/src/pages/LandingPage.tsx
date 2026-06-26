import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Map, ShieldCheck, Star, ArrowRight, UserCircle, Settings, Store, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

// Word by word animation for Hero
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 12, stiffness: 100 }
  }
};

export const LandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress, scrollY } = useScroll();
  
  // Mouse Position Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    // Normalize to -1 to 1
    const x = (clientX / innerWidth) * 2 - 1;
    const y = (clientY / innerHeight) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  // Parallax transforms based on scroll
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -300]);
  
  // Parallax transforms based on mouse (for floating icons)
  const floatX1 = useTransform(smoothMouseX, [-1, 1], [-40, 40]);
  const floatY1 = useTransform(smoothMouseY, [-1, 1], [-40, 40]);
  const floatX2 = useTransform(smoothMouseX, [-1, 1], [40, -40]);
  const floatY2 = useTransform(smoothMouseY, [-1, 1], [40, -40]);

  const scaleProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden font-sans relative"
    >
      {/* Top Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-[100]" 
        style={{ scaleX: scaleProgress }} 
      />

      {/* Noise Background Overlay */}
      <div className="fixed inset-0 bg-noise opacity-[0.03] pointer-events-none z-0"></div>
      
      {/* Animated Gradient Background Globs */}
      <motion.div 
        style={{ x: floatX1, y: floatY1 }} 
        className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"
      />
      <motion.div 
        style={{ x: floatX2, y: floatY2 }} 
        className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen"
      />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-12 flex flex-col items-center min-h-screen z-10">
        
        {/* Floating Icons (Orbiting the text) */}
        <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto hidden md:block">
          <motion.div 
            style={{ y: y1, x: floatX1 }} 
            className="absolute top-[20%] left-[15%] p-4 bg-zinc-900/80 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <UserCircle className="w-8 h-8 text-emerald-400" />
          </motion.div>
          <motion.div 
            style={{ y: y2, x: floatX2 }} 
            className="absolute top-[60%] left-[10%] p-4 bg-zinc-900/80 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md" 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Settings className="w-8 h-8 text-blue-400" />
          </motion.div>
          <motion.div 
            style={{ y: y1, x: floatX2 }} 
            className="absolute top-[15%] right-[15%] p-4 bg-zinc-900/80 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md" 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            <Store className="w-8 h-8 text-purple-400" />
          </motion.div>
          <motion.div 
            style={{ y: y2, x: floatX1 }} 
            className="absolute top-[65%] right-[10%] p-4 bg-zinc-900/80 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md" 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Sparkles className="w-8 h-8 text-amber-400" />
          </motion.div>
        </div>

        {/* Main Typography */}
        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.2 }
            }
          }}
          className="max-w-4xl mx-auto relative z-20 text-center"
        >
          <motion.div variants={textVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-300">Distribution First. Management Included.</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-6 leading-[1.1] text-white flex flex-col items-center">
            <div className="flex space-x-4 overflow-hidden">
              {"Events reimagined for".split(" ").map((word, i) => (
                <motion.span key={i} variants={textVariants} className="inline-block">{word}</motion.span>
              ))}
            </div>
            <motion.span 
              variants={textVariants}
              className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-emerald-400 bg-[length:200%_auto] animate-gradient"
            >
              Kenya.
            </motion.span>
          </h1>
          
          <motion.p variants={textVariants} className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Get your events in front of the right audience. We connect organizers with active event-goers looking for experiences like yours.
          </motion.p>

          <motion.div variants={textVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/explore" 
                className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-lg font-medium text-lg hover:bg-emerald-400 transition-colors shadow-glow hover:shadow-glow-lg w-full sm:w-auto"
              >
                Explore Events
                <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/register" 
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white border border-white/10 rounded-lg font-medium text-lg hover:bg-white/10 backdrop-blur-md transition-colors w-full sm:w-auto"
              >
                Organize an Event
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Fanning Art Gallery Section */}
        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.1, delayChildren: 0.8 }
            }
          }}
          className="relative h-[300px] sm:h-[400px] w-full max-w-5xl mx-auto mt-20 md:mt-32 flex justify-center items-center perspective-1000"
        >
          
          {/* Card 1 */}
          <motion.div 
            variants={{
              hidden: { x: 0, y: 100, scale: 0.5, opacity: 0, rotate: 0 },
              show: { x: -200, y: 40, scale: 0.85, opacity: 1, rotate: -10, transition: { type: "spring", stiffness: 100, damping: 20 } }
            }}
            whileHover={{ zIndex: 50, scale: 1.1, rotate: -5, y: 20 }}
            className="absolute z-10 cursor-pointer"
          >
            <div className="w-[120px] sm:w-[160px] h-[180px] sm:h-[240px] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/10 bg-zinc-900">
              <motion.img 
                whileHover={{ scale: 1.1 }} transition={{ duration: 0.4 }}
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-80" alt="Event" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            variants={{
              hidden: { x: 0, y: 100, scale: 0.5, opacity: 0, rotate: 0 },
              show: { x: -100, y: 20, scale: 0.9, opacity: 1, rotate: -5, transition: { type: "spring", stiffness: 100, damping: 20 } }
            }}
            whileHover={{ zIndex: 50, scale: 1.1, rotate: -2, y: 0 }}
            className="absolute z-20 cursor-pointer"
          >
            <div className="w-[120px] sm:w-[160px] h-[180px] sm:h-[240px] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/10 bg-zinc-900">
              <motion.img 
                whileHover={{ scale: 1.1 }} transition={{ duration: 0.4 }}
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-80" alt="Event" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
            </div>
          </motion.div>

          {/* Card 3 (Center) */}
          <motion.div 
            variants={{
              hidden: { x: 0, y: 100, scale: 0.5, opacity: 0, rotate: 0 },
              show: { x: 0, y: 0, scale: 1, opacity: 1, rotate: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
            }}
            whileHover={{ zIndex: 50, scale: 1.15, y: -20 }}
            className="absolute z-30 cursor-pointer"
          >
            <div className="w-[140px] sm:w-[180px] h-[200px] sm:h-[260px] rounded-2xl sm:rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.3)] overflow-hidden border border-emerald-500/50 bg-zinc-900">
              <motion.img 
                whileHover={{ scale: 1.1 }} transition={{ duration: 0.4 }}
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-100" alt="Event" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                <h3 className="text-white font-bold text-sm">Neon Nights</h3>
                <p className="text-emerald-400 text-xs">Nairobi</p>
              </div>
            </div>
          </motion.div>

          {/* Card 4 */}
          <motion.div 
            variants={{
              hidden: { x: 0, y: 100, scale: 0.5, opacity: 0, rotate: 0 },
              show: { x: 100, y: 20, scale: 0.9, opacity: 1, rotate: 5, transition: { type: "spring", stiffness: 100, damping: 20 } }
            }}
            whileHover={{ zIndex: 50, scale: 1.1, rotate: 2, y: 0 }}
            className="absolute z-20 cursor-pointer"
          >
            <div className="w-[120px] sm:w-[160px] h-[180px] sm:h-[240px] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/10 bg-zinc-900">
              <motion.img 
                whileHover={{ scale: 1.1 }} transition={{ duration: 0.4 }}
                src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-80" alt="Event" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
            </div>
          </motion.div>

          {/* Card 5 */}
          <motion.div 
            variants={{
              hidden: { x: 0, y: 100, scale: 0.5, opacity: 0, rotate: 0 },
              show: { x: 200, y: 40, scale: 0.85, opacity: 1, rotate: 10, transition: { type: "spring", stiffness: 100, damping: 20 } }
            }}
            whileHover={{ zIndex: 50, scale: 1.1, rotate: 5, y: 20 }}
            className="absolute z-10 cursor-pointer"
          >
            <div className="w-[120px] sm:w-[160px] h-[180px] sm:h-[240px] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/10 bg-zinc-900">
              <motion.img 
                whileHover={{ scale: 1.1 }} transition={{ duration: 0.4 }}
                src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-80" alt="Event" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* Marquee Section */}
      <div className="py-6 bg-emerald-500 overflow-hidden relative flex whitespace-nowrap z-10 border-y border-white/10">
        <motion.div 
          animate={{ x: [0, -1035] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
          className="flex items-center text-black font-black text-2xl uppercase tracking-widest"
        >
          {Array(10).fill(0).map((_, i) => (
            <React.Fragment key={i}>
              <span className="mx-6">Premium Venues</span>
              <span className="mx-6 text-emerald-900">•</span>
              <span className="mx-6">Secure Payments</span>
              <span className="mx-6 text-emerald-900">•</span>
              <span className="mx-6">Verified Hosts</span>
              <span className="mx-6 text-emerald-900">•</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-32 relative z-10 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-6">Why Choose Locyfy?</h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">We take the hassle out of finding and booking event spaces, letting you focus on the experience.</p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
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
          </motion.div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="py-32 relative z-10 border-t border-white/5 overflow-hidden">
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
          <h2 className="text-5xl md:text-7xl font-medium tracking-tight text-white mb-8">Ready to host your event?</h2>
          <p className="text-gray-400 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium">
            Join thousands of event planners who trust Locyfy to find the perfect venue.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/explore" 
              className="inline-flex items-center justify-center px-12 py-5 bg-white text-black rounded-xl font-bold text-xl hover:bg-gray-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]"
            >
              Start Exploring Now
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 50 },
      show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4, delay } }
    }}
    whileHover={{ y: -10, scale: 1.02 }}
    className="bg-zinc-900/50 border border-white/5 p-10 rounded-[2rem] hover:bg-zinc-800/80 hover:border-white/10 transition-colors group relative overflow-hidden"
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
    <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-inner">
      {icon}
    </div>
    <h3 className="text-2xl font-medium text-white mb-4">{title}</h3>
    <p className="text-gray-400 leading-relaxed text-base font-medium">{description}</p>
  </motion.div>
);
