"use client";

import dynamic from "next/dynamic";

// Load Scene component with proper CSS handling
// Using ssr: false prevents server-side CSS chunk creation
// The CSS preload warning is a dev-only Next.js optimization artifact and is harmless
const Scene = dynamic(() => import("@/components/3d/scene").then((mod) => mod.Scene), {
  ssr: false,
  loading: () => null,
});

export const SceneWrapper = () => {
  return <Scene />;
};
