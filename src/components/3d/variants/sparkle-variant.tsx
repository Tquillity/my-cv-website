"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { Group } from "three";

export const SparkleVariant: React.FC<{ color?: string }> = ({ color = "white" }) => {
  const ref = useRef<Group>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.rotation.y = Math.sin(t / 10) * 0.2;
      ref.current.rotation.x = Math.cos(t / 15) * 0.2;
    }
  });

  return (
    <group ref={ref}>
      <Sparkles 
        count={200} 
        scale={[20, 20, 10]} 
        size={2} 
        speed={0.4} 
        opacity={0.5} 
        color={color} // ✅ Pass color here
      />
    </group>
  );
};
