"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Custom Shader Material
const vertexShader = `
  uniform float uTime;
  uniform vec3 uObjectPositions[2];
  uniform float uObjectRadius;
  
  varying float vDistance;

  void main() {
    vec3 pos = position;
    
    // Interaction Logic: Bend lines away from objects
    for(int i = 0; i < 2; i++) {
      vec3 objPos = uObjectPositions[i];
      // Check if object is active (we can use a very far position like 999 to indicate inactive, 
      // or just assume if it's 0,0,0 it might be active. 
      // Better to assume the manager places them far away if inactive.)
      
      float dist = distance(pos, objPos);
      
      if (dist < uObjectRadius) {
        vec3 dir = normalize(pos - objPos);
        float pushFactor = (uObjectRadius - dist) * 0.8; // Smooth push
        
        // Push along normal direction
        pos += dir * pushFactor;
      }
    }

    // Gentle floating movement for the lines themselves
    pos.z += sin(pos.x * 0.5 + uTime * 0.5) * 0.1;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    vDistance = -mvPosition.z; // For fog/fading
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  varying float vDistance;

  void main() {
    // Simple distance fog
    float opacity = 1.0 - smoothstep(5.0, 20.0, vDistance);
    
    if (opacity < 0.01) discard;

    gl_FragColor = vec4(uColor, 0.4 * opacity); // Low opacity gold
  }
`;

type GoldenLinesProps = {
  objectPositions: [THREE.Vector3, THREE.Vector3];
};

export function GoldenLines({ objectPositions }: GoldenLinesProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Generate Spiral Points
  const points = useMemo(() => {
    const pts: number[] = [];
    const numSpirals = 8;
    const pointsPerSpiral = 150;

    for (let s = 0; s < numSpirals; s++) {
      // Vary parameters for "web" look
      const a = 0.5 + Math.random() * 0.2;
      const b = 0.2 + Math.random() * 0.1; // Growth factor
      const offset = (s / numSpirals) * Math.PI * 2;
      const zOffset = (Math.random() - 0.5) * 4;

      for (let i = 0; i < pointsPerSpiral; i++) {
        const theta = i * 0.1;
        const radius = a * Math.exp(b * theta);
        
        // Polars to Cartesian
        const x = radius * Math.cos(theta + offset);
        const y = radius * Math.sin(theta + offset);
        const z = (i * 0.02) + zOffset; // Slight depth variation

        pts.push(x, y, z);
      }
    }
    return new Float32Array(pts);
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      // Update object positions uniform
      // We need to flatten Vector3 array to float array or use set
      materialRef.current.uniforms.uObjectPositions.value = objectPositions;
    }
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#d4af37") }, // Gold
      uObjectPositions: { value: [new THREE.Vector3(999, 999, 999), new THREE.Vector3(999, 999, 999)] },
      uObjectRadius: { value: 3.5 }, // Radius of influence
    }),
    []
  );

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </lineSegments>
  );
}
