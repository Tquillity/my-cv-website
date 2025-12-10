"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { useBackground, BackgroundType } from "@/lib/background-context";
import { StarVariant } from "./variants/star-variant";
import { SparkleVariant } from "./variants/sparkle-variant";
import { NetworkVariant } from "./variants/network-variant";
import { NebulaVariant } from "./variants/nebula-variant";
import { GalaxyVariant } from "./variants/galaxy-variant";
import { AuroraVariant } from "./variants/aurora-variant";
import { PerspectiveCamera } from "three";

// Simple loader component
const Loader = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

// Camera resize handler component
const CameraResizer = () => {
  const { camera, size } = useThree();
  
  useEffect(() => {
    if (camera instanceof PerspectiveCamera) {
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
    }
  }, [size, camera]);

  return null;
};

// Advanced theme configuration for 3D elements
const THEME_CONFIG = {
  light: {
    color: "#0f172a", // Much darker slate for better contrast on light backgrounds
    nebulaColor: "#64748b", // Darker grey clouds
    nebulaDensity: 0.6,
    starOpacity: 1.0, // Full opacity for maximum visibility
    galaxyColor: "#4c1d95", // Darker purple for light mode
    auroraColor: "#059669", // Darker green for light mode
  },
  middle: {
    color: "#fbbf24", // Amber/Yellow
    nebulaColor: "#475569", // Darker Slate clouds
    nebulaDensity: 0.8, // +30% Clouds
    starOpacity: 1,
    galaxyColor: "#7c3aed", // Medium purple
    auroraColor: "#10b981", // Medium green
  },
  dark: {
    color: "#ffffff", // White Stars
    nebulaColor: "#ffffff", // White Clouds
    nebulaDensity: 0.4,
    starOpacity: 0.6,
    galaxyColor: "#a78bfa", // Lighter purple
    auroraColor: "#34d399", // Lighter green
  }
};

const BackgroundContent = ({ variant, config }: { variant: BackgroundType, config: any }) => {
  switch (variant) {
    case "stars":
      return <StarVariant color={config.color} opacity={config.starOpacity} />;
    case "network":
      return <NetworkVariant color={config.color} />;
    case "nebula":
      return <NebulaVariant color={config.nebulaColor} density={config.nebulaDensity} />;
    case "galaxy":
      return <GalaxyVariant color={config.galaxyColor} opacity={config.starOpacity} />;
    case "aurora":
      return <AuroraVariant color={config.auroraColor} opacity={config.starOpacity} />;
    case "space":
    default:
      return <SparkleVariant color={config.color} opacity={config.starOpacity} />;
  }
};

export const Scene: React.FC = () => {
  const { variant } = useBackground();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => setMounted(true), []);

  // Handle system theme changes without flickers
  const currentTheme = (theme === 'system' ? resolvedTheme : theme) as keyof typeof THEME_CONFIG || 'dark';
  const config = THEME_CONFIG[currentTheme] || THEME_CONFIG.dark;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Canvas will automatically resize via useThree hook in CameraResizer
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Accessibility: Hide canvas from screen readers
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.setAttribute('aria-hidden', 'true');
    }
  }, [mounted]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-background transition-colors duration-700">
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
      >
        <CameraResizer />
        <Suspense fallback={null}>
          {mounted && <BackgroundContent variant={variant} config={config} />}
        </Suspense>
      </Canvas>
    </div>
  );
};
