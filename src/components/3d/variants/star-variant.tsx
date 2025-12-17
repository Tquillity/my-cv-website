"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

interface StarVariantProps {
  color?: string;
  opacity?: number;
}

export const StarVariant: React.FC<StarVariantProps> = ({ 
  color = "#ffffff", 
  opacity = 1 
}) => {
  // Use 'any' for ref to avoid strict Three.js type conflicts in R3F v9
  const ref = useRef<any>(null);

  // Check for reduced motion preference safely
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Generate star positions once - Strict optimization
  const positions = useMemo(() => {
    const count = 6000;
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      pos[i3]     = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi) - 60;
    }
    
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (ref.current && !prefersReducedMotion) {
      ref.current.rotation.y += delta * 0.01;
    }
  });
  
  return (
    <group ref={ref}>
      <Points positions={positions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color={color}
          size={0.08}
          sizeAttenuation={true}
          opacity={opacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};
