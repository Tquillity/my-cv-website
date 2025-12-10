"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Cloud } from "@react-three/drei";
import { Group } from "three";

export const NebulaVariant: React.FC<{ color?: string; density?: number }> = ({ color = "#1e293b", density = 0.5 }) => {
  const groupRef = useRef<Group>(null);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current && !prefersReducedMotion) {
      // Very slow, smooth tumble
      groupRef.current.rotation.y += delta * 0.005;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime / 200) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      
      {/* Main Cloud Layer - Increased segments */}
      <Cloud
        opacity={0.4}
        speed={prefersReducedMotion ? 0 : 0.15}
        bounds={[20, 8, 20]}
        segments={Math.floor(50 * density)} // Increased from 20
        color={color}
        position={[0, 0, -8]}
      />
      
      {/* Secondary Layer for Depth */}
      <Cloud
        opacity={0.25}
        speed={prefersReducedMotion ? 0 : 0.1}
        bounds={[25, 12, 15]}
        segments={Math.floor(30 * density)}
        color={color}
        position={[5, -5, -15]}
      />

      {/* Tertiary Distant Layer */}
      <Cloud
        opacity={0.15}
        speed={prefersReducedMotion ? 0 : 0.08}
        bounds={[30, 15, 10]}
        segments={Math.floor(20 * density)}
        color={color}
        position={[-8, 8, -20]}
      />
    </group>
  );
};
