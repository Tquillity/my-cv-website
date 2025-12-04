"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { StarField } from "./star-field";

export const Scene: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-black">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <StarField />
        </Suspense>
      </Canvas>
    </div>
  );
};

