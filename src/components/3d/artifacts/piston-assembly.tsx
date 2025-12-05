"use client";

import { GroupProps } from "@react-three/fiber";
import * as THREE from "three";

const materialProps = {
  wireframe: true,
  color: "#00ffff", // Cyan
  transparent: true,
  opacity: 0.5,
};

export function PistonAssembly(props: GroupProps) {
  return (
    <group {...props}>
      {/* Piston Head */}
      <group position={[0, 1.5, 0]}>
        {/* Main Body */}
        <mesh>
          <cylinderGeometry args={[1.0, 1.0, 1.5, 32]} />
          <meshBasicMaterial {...materialProps} />
        </mesh>
        
        {/* Piston Rings (Indented grooves) */}
        <mesh position={[0, 0.4, 0]}>
          <torusGeometry args={[1.01, 0.02, 4, 48]} />
          <meshBasicMaterial {...materialProps} color="#ff00aa" />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <torusGeometry args={[1.01, 0.02, 4, 48]} />
          <meshBasicMaterial {...materialProps} color="#ff00aa" />
        </mesh>
        <mesh position={[0, 0.0, 0]}>
          <torusGeometry args={[1.01, 0.02, 4, 48]} />
          <meshBasicMaterial {...materialProps} color="#ff00aa" />
        </mesh>
        
        {/* Wrist Pin Hole */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, -0.3, 0]}>
           <cylinderGeometry args={[0.3, 0.3, 2.1, 16]} />
           <meshBasicMaterial {...materialProps} />
        </mesh>
      </group>

      {/* Connecting Rod */}
      <group position={[0, -0.5, 0]}>
        {/* The Beam */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.4, 2.5, 0.2]} />
          <meshBasicMaterial {...materialProps} />
        </mesh>
        
        {/* Reinforced Edges for I-beam look */}
        <mesh position={[-0.2, 0.5, 0]}>
           <boxGeometry args={[0.1, 2.5, 0.4]} />
           <meshBasicMaterial {...materialProps} />
        </mesh>
        <mesh position={[0.2, 0.5, 0]}>
           <boxGeometry args={[0.1, 2.5, 0.4]} />
           <meshBasicMaterial {...materialProps} />
        </mesh>

        {/* Connecting Bolts to Head */}
        <mesh position={[-0.3, 1.6, 0.3]} rotation={[0, Math.PI/4, 0]}>
           <cylinderGeometry args={[0.08, 0.08, 0.3, 6]} />
           <meshBasicMaterial {...materialProps} color="#ff00aa" />
        </mesh>
        <mesh position={[0.3, 1.6, 0.3]} rotation={[0, Math.PI/4, 0]}>
           <cylinderGeometry args={[0.08, 0.08, 0.3, 6]} />
           <meshBasicMaterial {...materialProps} color="#ff00aa" />
        </mesh>
      </group>

      {/* Crankshaft Bearing (Bottom) */}
      <group position={[0, -2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        {/* Outer Shell */}
        <mesh>
          <cylinderGeometry args={[0.8, 0.8, 1.0, 24]} />
          <meshBasicMaterial {...materialProps} />
        </mesh>
        {/* Inner Hole */}
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 1.1, 24]} />
          <meshBasicMaterial {...materialProps} color="#00aeef" />
        </mesh>
        {/* Bearing Split Line */}
        <mesh rotation={[0, 0, Math.PI/2]}>
           <boxGeometry args={[0.05, 1.6, 1.2]} />
           <meshBasicMaterial {...materialProps} />
        </mesh>
      </group>
    </group>
  );
}
