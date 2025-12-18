"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ThemeImageProps extends Omit<ImageProps, "src"> {
  srcLight: string;
  srcDark: string;
  srcMiddle: string;
  alt: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
}

export const ThemeImage = ({ srcLight, srcDark, srcMiddle, alt, loading, priority, ...imageProps }: ThemeImageProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by not rendering until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder that fills the container to prevent layout shift
    return (
      <div className={cn("w-full h-full bg-muted/10 animate-pulse", imageProps.className)} />
    );
  }

  // Map theme to image source
  const imageMap: Record<string, string> = {
    light: srcLight,
    dark: srcDark,
    middle: srcMiddle,
  };

  const src = imageMap[resolvedTheme || "light"] || srcLight;

  return <Image src={src} alt={alt} loading={loading} priority={priority} {...imageProps} />;
};
