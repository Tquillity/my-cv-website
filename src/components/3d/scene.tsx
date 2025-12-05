"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useBackground, BackgroundType } from "@/lib/background-context";
import { StarVariant } from "./variants/star-variant";
import { SparkleVariant } from "./variants/sparkle-variant";
import { NetworkVariant } from "./variants/network-variant";
import { NebulaVariant } from "./variants/nebula-variant";

// Helper to get 3D color based on theme
const getThemeColor = (theme: string | undefined) => {
  switch (theme) {
    case 'light': return '#1e293b'; // Slate 800 (Dark Grey stars)
    case 'middle': return '#fbbf24'; // Amber 400 (Yellow stars)
    case 'dark': 
    default: return '#ffffff'; // White stars
  }
};

const BackgroundContent = ({ variant, color }: { variant: BackgroundType, color: string }) => {
  switch (variant) {
    case "stars": return <StarVariant color={color} />;
    case "network": return <NetworkVariant color={color} />;
    case "nebula": return <NebulaVariant color={color} />;
    case "deep_space":
    default: return <SparkleVariant color={color} />;
  }
};

export const Scene: React.FC = () => {
  const { variant } = useBackground();
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Handle system theme on first load
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const color = getThemeColor(currentTheme);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-transparent">
      {/* Remove bg-black from div, let the CSS variable handle the page background */}
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          {mounted && <BackgroundContent variant={variant} color={color} />}
        </Suspense>
      </Canvas>
    </div>
  );
};
