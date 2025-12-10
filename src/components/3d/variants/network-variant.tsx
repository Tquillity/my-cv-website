"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Sphere } from "@react-three/drei";
import { Group, Vector3 } from "three";
import * as THREE from "three";

export const NetworkVariant: React.FC<{ color?: string }> = ({ color = "#3b82f6" }) => {
  const groupRef = useRef<Group>(null);
  
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const { nodes, connections } = useMemo(() => {
    const nodeCount = 30;
    const nodes: Vector3[] = [];
    const connections: [Vector3, Vector3][] = [];

    // Generate Nodes
    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * 30;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 15 - 10; // Push back slightly
      nodes.push(new Vector3(x, y, z));
    }

    // Generate Connections based on distance
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodes[i].distanceTo(nodes[j]);
        if (dist < 10) { // Connect if close enough
          connections.push([nodes[i], nodes[j]]);
        }
      }
    }

    return { nodes, connections };
  }, []);

  useFrame((state) => {
    if (groupRef.current && !prefersReducedMotion) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02; // Slow rotation
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Draw Lines */}
      <Line
        segments
        color={color}
        points={connections.flat()}
        lineWidth={1}
        transparent
        opacity={0.2}
      />
      {/* Draw Nodes */}
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
};
