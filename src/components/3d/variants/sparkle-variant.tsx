"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { Group } from "three";

export const SparkleVariant: React.FC<{ color?: string; opacity?: number }> = ({ color = "white", opacity = 1 }) => {
  const ref = useRef<Group>(null);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Dynamic opacity based on particle count
  const dynamicOpacity = useMemo(() => {
    const particleCount = 500;
    return Math.min(opacity, 1 / (particleCount / 1000));
  }, [opacity]);

  useFrame((state, delta) => {
    if (ref.current && !prefersReducedMotion) {
      // Very slow, smooth rotation (divide by 100+)
      const t = state.clock.getElapsedTime();
      ref.current.rotation.y = Math.sin(t / 150) * 0.05;
    }
  });

  return (
    <group ref={ref}>
      <Sparkles 
        count={500} // Reduced for vast emptiness
        scale={[50, 50, 50]} 
        size={1.5} 
        speed={0.1} // Slower for subtlety
        opacity={dynamicOpacity} 
        color={color}
        noise={1} // Reduced noise for cleaner look
      />
    </group>
  );
};
