"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

export const GalaxyVariant: React.FC<{ color?: string; opacity?: number }> = ({ color = "#8b5cf6", opacity = 1 }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const { positions, colors } = useMemo(() => {
    const count = 5000; // Increased count for better density
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const base = new THREE.Color(color);
    const white = new THREE.Color("#ffffff");

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const arm = Math.floor(i / (count / 3)); // 3 Arms
      const radius = Math.random() * 40 + 5; // Spread out more
      const spinAngle = radius * 0.5; // Tighter spiral
      const branchAngle = (arm * 2 * Math.PI) / 3;
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;
      const x = Math.cos(branchAngle + spinAngle) * radius + randomX;
      const y = (Math.random() - 0.5) * 4; // Flattened disk
      const z = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Push back on Z axis so it's in front of camera, not inside it
      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z - 30;

      // Color mixing (center is brighter/white)
      const mixedColor = base.clone().lerp(white, 1 / (radius * 0.5 + 1));
      col[i3] = mixedColor.r;
      col[i3 + 1] = mixedColor.g;
      col[i3 + 2] = mixedColor.b;
    }

    return { positions: pos, colors: col };
  }, [color]);

  useFrame((state) => {
    if (pointsRef.current && !prefersReducedMotion) {
      // Slow majesty rotation
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.5} // Smaller, sharper stars
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={opacity}
      />
    </Points>
  );
};
