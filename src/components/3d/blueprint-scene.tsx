"use client";

import { useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GoldenLines } from "./golden-lines";
import { ArtifactManager } from "./artifact-manager";

type BlueprintSceneProps = {
  interactive?: boolean;
  mode?: 'random-dual' | 'single-center';
  selectedArtifactId?: string | null;
};

export function BlueprintScene({ 
  interactive = false, 
  mode = 'random-dual',
  selectedArtifactId
}: BlueprintSceneProps) {
  const positionsRef = useRef<[THREE.Vector3, THREE.Vector3]>([
    new THREE.Vector3(999, 999, 999),
    new THREE.Vector3(999, 999, 999),
  ]);

  return (
    <>
      <color attach="background" args={['#050510']} />
      <fog attach="fog" args={['#050510', 5, 30]} />

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />

      <GoldenLines objectPositions={positionsRef.current} />

      <ArtifactManager 
        positionsRef={positionsRef} 
        mode={mode}
        selectedArtifactId={selectedArtifactId}
      />

      {/* Spatial Context */}
      <gridHelper position={[0, -5, 0]} args={[40, 40, '#1a1a2e', '#0a0a14']} />
      
      <OrbitControls 
        enabled={interactive}
        enableZoom={interactive} 
        enablePan={interactive} 
        enableRotate={interactive} 
        autoRotate={interactive}
        autoRotateSpeed={0.5}
      />
    </>
  );
}
