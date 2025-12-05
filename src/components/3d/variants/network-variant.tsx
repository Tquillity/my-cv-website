"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Icosahedron, Float } from "@react-three/drei";
import { Group } from "three";

export const NetworkVariant: React.FC<{ color?: string }> = ({ color = "white" }) => {
  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Icosahedron args={[15, 1]} position={[0, 0, -5]}>
          <meshBasicMaterial color={color} wireframe transparent opacity={0.1} />
        </Icosahedron>
      </Float>
      
      <Float speed={3} rotationIntensity={1} floatIntensity={1}>
        <Icosahedron args={[8, 0]} position={[5, -5, -10]}>
          <meshBasicMaterial color={color} wireframe transparent opacity={0.15} />
        </Icosahedron>
      </Float>
    </group>
  );
};
