import { useEffect, useRef } from 'react';

interface TrailParticle {
  x: number;
  y: number;
  life: number;
  size: number;
  opacity: number;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<TrailParticle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      
      // Add new particle
      particlesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        life: 1,
        size: Math.random() * 3 + 2,
        opacity: 0.6
      });

      // Limit particles
      if (particlesRef.current.length > 50) {
        particlesRef.current.shift();
      }
    };

    window.addEventListener('pointermove', handleMouseMove);

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.life -= 0.02;
        
        if (particle.life <= 0) return false;

        // Draw glowing particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Purple glow gradient
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 4
        );
        gradient.addColorStop(0, `rgba(155, 77, 255, ${particle.life * particle.opacity})`);
        gradient.addColorStop(0.5, `rgba(181, 23, 255, ${particle.life * particle.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(155, 77, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fill();

        return true;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
    />
  );
}
