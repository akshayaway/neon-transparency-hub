import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function FloatingS() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animation for parallax
  const springConfig = { damping: 30, stiffness: 100 };
  const x = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig);
  const y = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY, currentTarget } = e;
      const target = currentTarget as Window;
      
      // Normalize mouse position to -0.5 to 0.5
      const x = (clientX / target.innerWidth) - 0.5;
      const y = (clientY / target.innerHeight) - 0.5;
      
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('pointermove', handleMouseMove);
    return () => window.removeEventListener('pointermove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="absolute inset-0 flex items-start justify-center pointer-events-none pt-8 md:pt-12"
      style={{
        x,
        y,
        rotateY,
        rotateX,
        perspective: 1200,
      }}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Main glowing S */}
      <motion.div
        className="relative"
        animate={{
          y: [-10, -20, -10],
          rotateZ: [-2, 2, -2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Glow layers */}
        <div className="absolute inset-0 blur-2xl md:blur-3xl opacity-40 md:opacity-50">
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(155,77,255,0.8), transparent 70%)',
            }}
          />
        </div>
        
        <motion.div
          className="relative text-[12rem] sm:text-[18rem] md:text-[25rem] lg:text-[32rem] xl:text-[40rem] font-heading font-bold leading-none select-none"
          style={{
            color: 'transparent',
            WebkitTextStroke: '2px rgba(155, 77, 255, 0.4)',
            textShadow: '0 0 40px rgba(155, 77, 255, 0.8), 0 0 80px rgba(155, 77, 255, 0.5)',
          }}
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          S
        </motion.div>

        {/* Purple rays */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <div 
            className="w-[30rem] h-[30rem] sm:w-[40rem] sm:h-[40rem] md:w-[50rem] md:h-[50rem] lg:w-[60rem] lg:h-[60rem] opacity-20"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(155,77,255,0.3) 10%, transparent 20%, transparent 30%, rgba(181,23,255,0.3) 40%, transparent 50%, transparent 60%, rgba(155,77,255,0.3) 70%, transparent 80%)',
              filter: 'blur(40px)',
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
