import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function FloatingS() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animation for parallax with 3-5% depth shift
  const springConfig = { damping: 25, stiffness: 80 };
  const x = useSpring(useTransform(mouseX, [-0.5, 0.5], [-30, 30]), springConfig);
  const y = useSpring(useTransform(mouseY, [-0.5, 0.5], [-30, 30]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);

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
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{
        x,
        y,
        rotateY,
        rotateX,
        perspective: 1500,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {/* Soft radial nebula glow behind S */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div 
          className="w-[40rem] h-[40rem] sm:w-[60rem] sm:h-[60rem] md:w-[80rem] md:h-[80rem] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(155,77,255,0.25), rgba(181,23,255,0.15) 40%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </motion.div>

      {/* Main glowing S */}
      <motion.div
        className="relative"
        animate={{
          y: [-15, -30, -15],
          rotateZ: [-3, 3, -3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Multiple glow layers for neon aura */}
        <div className="absolute inset-0 blur-3xl opacity-50">
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(155,77,255,0.9), rgba(181,23,255,0.6) 40%, transparent 70%)',
            }}
          />
        </div>
        
        <div className="absolute inset-0 blur-[100px] opacity-30">
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(155,77,255,1), transparent 60%)',
            }}
          />
        </div>
        
        <motion.div
          className="relative text-[12rem] sm:text-[18rem] md:text-[25rem] lg:text-[32rem] xl:text-[40rem] font-heading font-bold leading-none select-none"
          style={{
            color: 'transparent',
            WebkitTextStroke: '3px rgba(155, 77, 255, 0.5)',
            textShadow: '0 0 50px rgba(155, 77, 255, 1), 0 0 100px rgba(155, 77, 255, 0.8), 0 0 150px rgba(181, 23, 255, 0.6)',
            transform: 'translateZ(50px)',
          }}
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          S
        </motion.div>

        {/* Animated light rays */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <div 
            className="w-[30rem] h-[30rem] sm:w-[40rem] sm:h-[40rem] md:w-[50rem] md:h-[50rem] lg:w-[60rem] lg:h-[60rem] opacity-25"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(155,77,255,0.4) 8%, transparent 16%, transparent 25%, rgba(181,23,255,0.4) 33%, transparent 41%, transparent 50%, rgba(155,77,255,0.4) 58%, transparent 66%, transparent 75%, rgba(181,23,255,0.4) 83%, transparent 91%)',
              filter: 'blur(50px)',
            }}
          />
        </motion.div>

        {/* Counter-rotating rays */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          <div 
            className="w-[35rem] h-[35rem] sm:w-[45rem] sm:h-[45rem] md:w-[55rem] md:h-[55rem] lg:w-[65rem] lg:h-[65rem] opacity-15"
            style={{
              background: 'conic-gradient(from 45deg, transparent 0%, rgba(155,77,255,0.3) 12%, transparent 24%, transparent 36%, rgba(181,23,255,0.3) 48%, transparent 60%, transparent 72%, rgba(155,77,255,0.3) 84%, transparent 96%)',
              filter: 'blur(60px)',
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
