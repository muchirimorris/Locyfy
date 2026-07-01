import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const cursorXSpring2 = useSpring(cursorX, { damping: 30, stiffness: 200, mass: 0.8 });
  const cursorYSpring2 = useSpring(cursorY, { damping: 30, stiffness: 200, mass: 0.8 });

  const cursorXSpring3 = useSpring(cursorX, { damping: 40, stiffness: 100, mass: 1.2 });
  const cursorYSpring3 = useSpring(cursorY, { damping: 40, stiffness: 100, mass: 1.2 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'button' || 
        target.tagName.toLowerCase() === 'a' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Main dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-emerald-400 rounded-full pointer-events-none z-[9999] mix-blend-screen"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          scale: isClicking ? 0.5 : isHovering ? 2.5 : 1,
          opacity: isHovering ? 0.8 : 1,
        }}
        transition={{ type: 'spring', stiffness: 1000, damping: 40 }}
      />
      
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border-2 border-emerald-400 rounded-full pointer-events-none z-[9998] mix-blend-screen"
        style={{ x: cursorXSpring, y: cursorYSpring, translateX: '-50%', translateY: '-50%' }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
          borderColor: isHovering ? 'rgba(52, 211, 153, 0)' : 'rgba(52, 211, 153, 0.5)',
          backgroundColor: isHovering ? 'rgba(52, 211, 153, 0.1)' : 'transparent',
          rotate: isHovering ? 90 : 0
        }}
      />

      {/* Trail 1 */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-teal-300 rounded-full pointer-events-none z-[9997] mix-blend-screen opacity-60"
        style={{ x: cursorXSpring2, y: cursorYSpring2, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: isHovering ? 0 : 1 }}
      />

      {/* Trail 2 */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-cyan-200 rounded-full pointer-events-none z-[9996] mix-blend-screen opacity-40"
        style={{ x: cursorXSpring3, y: cursorYSpring3, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: isHovering ? 0 : 1 }}
      />
    </>
  );
};
