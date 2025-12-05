"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useBackground, BackgroundType } from "@/lib/background-context";
import { StarVariant } from "./variants/star-variant";
import { SparkleVariant } from "./variants/sparkle-variant";
import { NetworkVariant } from "./variants/network-variant";
import { NebulaVariant } from "./variants/nebula-variant";

const BackgroundContent = ({ variant }: { variant: BackgroundType }) => {
  switch (variant) {
    case "stars": return <StarVariant />;
    case "network": return <NetworkVariant />;
    case "nebula": return <NebulaVariant />;
    case "deep_space":
    default: return <SparkleVariant />;
  }
};

export const Scene: React.FC = () => {
  const { variant } = useBackground();

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-black">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <BackgroundContent variant={variant} />
        </Suspense>
      </Canvas>
    </div>
  );
};
