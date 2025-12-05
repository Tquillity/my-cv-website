"use client";

import { GroupProps } from "@react-three/fiber";
import * as THREE from "three";

const materialProps = {
  wireframe: true,
  color: "#00ffff", // Cyan
  transparent: true,
  opacity: 0.5,
};

export function TechWheel(props: GroupProps) {
  return (
    <group {...props}>
      {/* Rugged Tread (Low poly cylinder) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.8, 8]} /> {/* 8 segments = Octagonal rugged look */}
        <meshBasicMaterial {...materialProps} />
      </mesh>
      
      {/* Tread Detail Lines */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.55, 1.55, 0.2, 8]} />
        <meshBasicMaterial {...materialProps} color="#ff00aa" />
      </mesh>

      {/* Hubcap Assembly */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        {/* Outer Rim */}
        <mesh>
          <torusGeometry args={[1.0, 0.1, 4, 24]} />
          <meshBasicMaterial {...materialProps} />
        </mesh>
        
        {/* Inner Rim */}
        <mesh>
          <torusGeometry args={[0.5, 0.1, 4, 24]} />
          <meshBasicMaterial {...materialProps} />
        </mesh>

        {/* Center Hub */}
        <mesh>
           <cylinderGeometry args={[0.3, 0.3, 0.9, 16]} />
           <meshBasicMaterial {...materialProps} />
        </mesh>

        {/* Spokes (6-way) */}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i / 6) * Math.PI * 2]}>
             {/* Move spoke out from center */}
             <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[0.1, 1.0, 0.1]} />
                <meshBasicMaterial {...materialProps} />
             </mesh>
          </mesh>
        ))}
      </group>

      {/* Suspension Spring (Behind) */}
      <group position={[0, 0, -0.6]}>
         {/* Helper for spring visualization: Stacked toruses */}
         {Array.from({ length: 5 }).map((_, i) => (
           <mesh key={i} position={[0, 0, -i * 0.2]}>
             <torusGeometry args={[0.4, 0.05, 6, 12]} />
             <meshBasicMaterial {...materialProps} opacity={0.3} />
           </mesh>
         ))}
         {/* Central Strut */}
         <mesh rotation={[Math.PI/2, 0, 0]} position={[0, 0, -0.5]}>
            <cylinderGeometry args={[0.1, 0.1, 1.5, 8]} />
            <meshBasicMaterial {...materialProps} color="#00aeef" />
         </mesh>
      </group>
    </group>
  );
}
