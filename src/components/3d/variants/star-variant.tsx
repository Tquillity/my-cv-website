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
      <Sparkles count={3000} scale={[100, 100, 100]} size={2} speed={0} opacity={opacity} color={color} />
    </group>
  );
};
