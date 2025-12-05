"use client";

import { Cloud } from "@react-three/drei";

export const NebulaVariant: React.FC<{ color?: string; density?: number }> = ({ color = "#1e293b", density = 0.5 }) => {
  return (
    <group>
      <ambientLight intensity={0.5} />
      <Cloud
        opacity={0.3}
        speed={0.2}
        bounds={[10, 2, 10]}
        segments={20 * density} // Scale segments based on density
        color={color}
      />
    </group>
  );
};
