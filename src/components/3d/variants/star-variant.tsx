"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { Group } from "three";

export const StarVariant: React.FC<{ color?: string; opacity?: number }> = ({ color = "#FFF", opacity = 1 }) => {
  const ref = useRef<Group>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group ref={ref}>
      {/* High count small sparkles simulate stars but are colorable */}
      <Sparkles
        count={2000}
        scale={[120, 120, 120]} // Spread them out more
        size={1.2}
        speed={0.05} // MUCH SLOWER - majestic movement
        opacity={opacity}
        color={color}
        noise={0.02} // Very subtle movement
      />
    </group>
  );
};
