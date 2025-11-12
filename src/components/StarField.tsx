import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

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

    // Track mouse for parallax
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener('pointermove', handleMouseMove);

    // Create stars
    const stars: Star[] = [];
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedY: Math.random() * 0.2 + 0.1,
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.5 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    // Animation loop
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Parallax offset based on mouse
      const parallaxX = (mouseRef.current.x - 0.5) * 30;
      const parallaxY = (mouseRef.current.y - 0.5) * 30;

      stars.forEach((star) => {
        // Update position with slight parallax
        star.y -= star.speedY;
        star.x += star.speedX;

        // Apply parallax effect
        const parallaxedX = star.x + parallaxX * (star.size / 3);
        const parallaxedY = star.y + parallaxY * (star.size / 3);

        // Reset star if it goes off screen
        if (star.y < -10) {
          star.y = canvas.height + 10;
          star.x = Math.random() * canvas.width;
        }
        if (star.x < -10 || star.x > canvas.width + 10) {
          star.x = Math.random() * canvas.width;
        }

        // Twinkling effect
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const currentOpacity = star.opacity * (0.5 + twinkle * 0.5);

        // Draw star with purple glow
        ctx.beginPath();
        ctx.arc(parallaxedX, parallaxedY, star.size, 0, Math.PI * 2);
        
        // Small purple glow
        const gradient = ctx.createRadialGradient(
          parallaxedX, parallaxedY, 0,
          parallaxedX, parallaxedY, star.size * 4
        );
        gradient.addColorStop(0, `rgba(181, 23, 255, ${currentOpacity})`);
        gradient.addColorStop(0.5, `rgba(155, 77, 255, ${currentOpacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(155, 77, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fill();
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
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
