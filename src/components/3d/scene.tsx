"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useBackground, BackgroundType } from "@/lib/background-context";
import { StarVariant } from "./variants/star-variant";
import { SparkleVariant } from "./variants/sparkle-variant";
import { NetworkVariant } from "./variants/network-variant";
import { NebulaVariant } from "./variants/nebula-variant";

// Advanced theme configuration for 3D elements
const THEME_CONFIG = {
  light: {
    color: "#1e293b", // Dark Grey for Stars/Network
    nebulaColor: "#94a3b8", // Greyish clouds
    nebulaDensity: 0.5,
    starOpacity: 0.8, // Dark stars need high opacity to be seen
  },
  middle: {
    color: "#fbbf24", // Amber/Yellow
    nebulaColor: "#475569", // Darker Slate clouds
    nebulaDensity: 0.8, // +30% Clouds
    starOpacity: 1,
  },
  dark: {
    color: "#ffffff", // White Stars
    nebulaColor: "#ffffff", // White Clouds (Requested)
    nebulaDensity: 0.3,
    starOpacity: 0.5,
  }
};

const BackgroundContent = ({ variant, config }: { variant: BackgroundType, config: any }) => {
  switch (variant) {
    case "stars": return <StarVariant color={config.color} opacity={config.starOpacity} />;
    case "network": return <NetworkVariant color={config.color} />;
    case "nebula": return <NebulaVariant color={config.nebulaColor} density={config.nebulaDensity} />;
    case "deep_space":
    default: return <SparkleVariant color={config.color} opacity={config.starOpacity} />;
  }
};

export const Scene: React.FC = () => {
  const { variant } = useBackground();
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Handle system theme on first load
  const currentTheme = (theme === 'system' ? systemTheme : theme) as keyof typeof THEME_CONFIG || 'dark';
  const config = THEME_CONFIG[currentTheme];

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-background transition-colors duration-700">
      {/* Remove bg-black from div, let the CSS variable handle the page background */}
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          {mounted && <BackgroundContent variant={variant} config={config} />}
        </Suspense>
      </Canvas>
    </div>
  );
};
