"use client";

import dynamic from "next/dynamic";
import { ThreeErrorBoundary } from "@/components/3d/error-boundary";

const Scene = dynamic(() => import("@/components/3d/scene").then((mod) => mod.Scene), {
  ssr: false,
  loading: () => null,
});

export const SceneWrapper = () => {
  return (
    <ThreeErrorBoundary fallback={<div className="fixed inset-0 -z-10 bg-background" />}>
      <Scene />
    </ThreeErrorBoundary>
  );
};
