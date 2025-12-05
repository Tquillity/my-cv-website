"use client";

import { useState, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { RaptorEngine } from "./artifacts/raptor-engine";
import { PistonAssembly } from "./artifacts/piston-assembly";
import { TechWheel } from "./artifacts/tech-wheel";

type ArtifactManagerProps = {
  positionsRef: React.MutableRefObject<[THREE.Vector3, THREE.Vector3]>;
  mode?: 'random-dual' | 'single-center';
  selectedArtifactId?: string | null;
};

export const ARTIFACTS = [
  { Component: RaptorEngine, id: 'raptor', name: 'Raptor Engine V3' },
  { Component: PistonAssembly, id: 'piston', name: 'Piston Assembly' },
  { Component: TechWheel, id: 'wheel', name: 'Tech Wheel' },
];

export function ArtifactManager({ 
  positionsRef, 
  mode = 'random-dual',
  selectedArtifactId 
}: ArtifactManagerProps) {
  
  // Fixed positions for the dual slots
  const dualSlotPositions = [
    new THREE.Vector3(-3, 0, -2),
    new THREE.Vector3(3, 0, -2)
  ];

  const groupRefs = useRef<(THREE.Group | null)[]>([null, null]);
  const [slots, setSlots] = useState([0, 1]); 

  // Random Cycle Logic (only if in random-dual mode)
  useEffect(() => {
    if (mode !== 'random-dual') return;

    const interval = setInterval(() => {
      setSlots(prev => {
        const next0 = prev[1];
        const next1 = (prev[1] + 1) % ARTIFACTS.length;
        return [next0, next1];
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [mode]);

  useFrame(() => {
    // Update shader refs
    if (mode === 'random-dual') {
      groupRefs.current.forEach((group, index) => {
        if (group) {
          const worldPos = new THREE.Vector3();
          group.getWorldPosition(worldPos);
          positionsRef.current[index].copy(worldPos);
        } else {
          positionsRef.current[index].set(999, 999, 999);
        }
      });
    } else {
      // In single mode, we have one object in center.
      // Let's say index 0 is the center object, index 1 is far away.
      if (groupRefs.current[0]) {
         const worldPos = new THREE.Vector3();
         groupRefs.current[0].getWorldPosition(worldPos);
         positionsRef.current[0].copy(worldPos);
      }
      positionsRef.current[1].set(999, 999, 999);
    }
  });

  if (mode === 'single-center') {
    const artifactIndex = ARTIFACTS.findIndex(a => a.id === selectedArtifactId);
    if (artifactIndex === -1) return null;
    
    const Artifact = ARTIFACTS[artifactIndex].Component;
    
    return (
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5} position={[0, 0, 0]}>
         <group ref={el => { groupRefs.current[0] = el; }}>
            <Artifact scale={1.2} />
         </group>
      </Float>
    );
  }

  // Default: random-dual
  return (
    <>
      {slots.map((artifactIdx, slotIdx) => {
        const Artifact = ARTIFACTS[artifactIdx].Component;
        const position = dualSlotPositions[slotIdx];

        return (
          <Float 
            key={`${artifactIdx}-${slotIdx}`} 
            speed={2} 
            rotationIntensity={0.5} 
            floatIntensity={0.5} 
            position={position.toArray()}
          >
            <group ref={el => { groupRefs.current[slotIdx] = el; }}>
              <Artifact scale={0.7} />
            </group>
          </Float>
        );
      })}
    </>
  );
}
