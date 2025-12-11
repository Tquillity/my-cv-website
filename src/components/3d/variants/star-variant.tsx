"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useTheme } from "next-themes";
import * as THREE from "three";

export const StarVariant: React.FC<{ color?: string; opacity?: number }> = ({ color = "#ffffff", opacity = 1 }) => {
  const ref = useRef<any>(null);
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Dark stars in light mode, white in dark mode
  const isLight = resolvedTheme === "light";
  const starColor = isLight ? "#1f2937" : color;

  // Generate star positions - use seeded approach or generate once
  const positions = useMemo(() => {
    if (!isMounted) return new Float32Array(0);
    
    const count = 6000;
    const pos = new Float32Array(count * 3);
    
    // Use a seeded random or generate once on mount
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
  }, [isMounted]);
  
  if (!isMounted) return null;

  useFrame((state, delta) => {
    if (ref.current && !prefersReducedMotion) {
      // Very slow, smooth rotation
      ref.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <group ref={ref}>
      <Points positions={positions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color={starColor}
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
