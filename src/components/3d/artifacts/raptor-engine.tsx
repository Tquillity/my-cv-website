"use client";

import { useMemo } from "react";
import { GroupProps } from "@react-three/fiber";
import * as THREE from "three";

const materialProps = {
  wireframe: true,
  color: "#00ffff", // Cyan
  transparent: true,
  opacity: 0.5,
};

export function RaptorEngine(props: GroupProps) {
  // Generate the bell nozzle profile (LatheGeometry)
  const nozzlePoints = useMemo(() => {
    const points = [];
    // Start from top (chamber) down to bottom (bell rim)
    // We want a smooth curve: wide at bell, narrow at throat, wider at chamber
    
    // 1. Chamber area (top)
    points.push(new THREE.Vector2(0.5, 1.0));
    points.push(new THREE.Vector2(0.5, 0.5)); 
    
    // 2. Throat (narrowest point)
    points.push(new THREE.Vector2(0.25, 0.0));
    
    // 3. Bell (expanding parabola)
    for (let i = 0; i <= 10; i++) {
      const t = i / 10; // 0 to 1
      // x expands from 0.25 to ~1.2
      // y goes from 0.0 to -2.0
      const x = 0.25 + Math.pow(t, 1.8) * 1.0; 
      const y = -t * 2.5;
      points.push(new THREE.Vector2(x, y));
    }
    
    return points;
  }, []);

  // Procedural "Greeble" pipes for the powerhead
  const pipes = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => {
      const angle = (i / 6) * Math.PI * 2;
      return {
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
        position: [Math.cos(angle) * 0.4, 1.5 + Math.random() * 0.5, Math.sin(angle) * 0.4] as [number, number, number],
        radius: 0.3 + Math.random() * 0.2,
        tube: 0.05,
      };
    });
  }, []);

  return (
    <group {...props}>
      {/* SECTION A: Bell Nozzle & Chamber */}
      <mesh>
        <latheGeometry args={[nozzlePoints, 32]} />
        <meshBasicMaterial {...materialProps} />
      </mesh>

      {/* SECTION C: Manifolds & Rings */}
      {/* Rim Reinforcement */}
      <mesh position={[0, -2.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.25, 0.05, 8, 48]} />
        <meshBasicMaterial {...materialProps} />
      </mesh>
      
      {/* Throat Manifold */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.35, 0.08, 8, 32]} />
        <meshBasicMaterial {...materialProps} color="#ff00aa" />
      </mesh>

      {/* TVC Ring (Thrust Vector Control) */}
      <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.05, 8, 48]} />
        <meshBasicMaterial {...materialProps} />
      </mesh>

      {/* SECTION B: Powerhead (Turbopumps & Machinery) */}
      <group position={[0, 1.2, 0]}>
         {/* Main Pump Housing 1 */}
         <mesh position={[0.5, 0.5, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 1.2, 16]} />
            <meshBasicMaterial {...materialProps} color="#00aeef" />
         </mesh>
         
         {/* Main Pump Housing 2 */}
         <mesh position={[-0.5, 0.2, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 1.0, 16]} />
            <meshBasicMaterial {...materialProps} color="#00aeef" />
         </mesh>

         {/* Pre-burner Complex (Sphere) */}
         <mesh position={[0, 1.0, 0.4]}>
            <sphereGeometry args={[0.4, 12, 12]} />
            <meshBasicMaterial {...materialProps} />
         </mesh>

         {/* Greeble Pipes (Randomized piping mess) */}
         {pipes.map((pipe, i) => (
           <mesh key={i} position={pipe.position} rotation={pipe.rotation}>
             <torusGeometry args={[pipe.radius, pipe.tube, 8, 16]} />
             <meshBasicMaterial {...materialProps} opacity={0.3} />
           </mesh>
         ))}
         
         {/* Vertical Feed Lines */}
         <mesh position={[0.6, -0.5, 0]} rotation={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.08, 0.08, 1.5, 8]} />
            <meshBasicMaterial {...materialProps} />
         </mesh>
         <mesh position={[-0.6, -0.5, 0]} rotation={[0, 0, -0.2]}>
            <cylinderGeometry args={[0.08, 0.08, 1.5, 8]} />
            <meshBasicMaterial {...materialProps} />
         </mesh>
      </group>
    </group>
  );
}
