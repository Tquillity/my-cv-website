"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { useTheme } from "next-themes";

interface ThemeImageProps extends Omit<ImageProps, "src"> {
  srcLight: string;
  srcDark: string;
  srcMiddle: string;
  alt: string;
}

export const ThemeImage = ({ srcLight, srcDark, srcMiddle, alt, ...imageProps }: ThemeImageProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by not rendering until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return (
      <div 
        style={{ 
          width: imageProps.width || "32px", 
          height: imageProps.height || "32px" 
        }}
        className={imageProps.className}
      />
    );
  }

  // Map theme to image source
  const imageMap: Record<string, string> = {
    light: srcLight,
    dark: srcDark,
    middle: srcMiddle,
  };

  const src = imageMap[resolvedTheme || "light"] || srcLight;

  return <Image src={src} alt={alt} {...imageProps} />;
};
