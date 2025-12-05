"use client";

import { Cloud } from "@react-three/drei";

export const NebulaVariant: React.FC = () => {
  return (
    <group>
      <ambientLight intensity={0.5} />
      <Cloud 
        opacity={0.3} 
        speed={0.2} 
        bounds={[10, 2, 10]}
        segments={20} 
        color="#1e293b" 
      />
    </group>
  );
};
