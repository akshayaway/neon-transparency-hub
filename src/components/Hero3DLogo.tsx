import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Mesh } from 'three';
import { Html } from '@react-three/drei';
import sfLogo from '@/assets/sf-logo.png';

function FloatingLogo() {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Gentle rotation
    meshRef.current.rotation.y += 0.005;
    
    // Mouse parallax effect
    const { pointer } = state;
    meshRef.current.rotation.x = pointer.y * 0.2;
    meshRef.current.rotation.z = pointer.x * 0.1;
    
    // Floating animation
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      <planeGeometry args={[4, 4]} />
      <meshStandardMaterial
        map={null}
        transparent
        opacity={0}
      />
      <Html center>
        <img 
          src={sfLogo} 
          alt="SuperFunded Logo" 
          className="w-64 h-64 animate-glow-pulse pointer-events-none"
          style={{
            filter: 'drop-shadow(0 0 30px rgba(155, 77, 255, 0.6))',
          }}
        />
      </Html>
    </mesh>
  );
}

export default function Hero3DLogo() {
  return (
    <div className="h-[500px] w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#9B4DFF" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#B517FF" />
        <FloatingLogo />
      </Canvas>
    </div>
  );
}
