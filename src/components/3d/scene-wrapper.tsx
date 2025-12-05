"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/components/3d/scene").then((mod) => mod.Scene), {
  ssr: false,
});

export const SceneWrapper = () => {
  return <Scene />;
};
