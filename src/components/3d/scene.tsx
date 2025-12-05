"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { BlueprintScene } from "./blueprint-scene";

export const Scene: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-black">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <Suspense fallback={null}>
          <BlueprintScene interactive={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}
