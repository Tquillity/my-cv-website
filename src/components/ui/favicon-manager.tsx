"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export const FaviconManager = () => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;

    // Find the existing favicon link or create one
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    // Map theme to favicon
    const faviconMap: Record<string, string> = {
      light: "/logos/favicon-light.ico",
      dark: "/logos/favicon-dark.ico",
      middle: "/logos/favicon-middle.ico",
    };

    const faviconPath = faviconMap[resolvedTheme] || faviconMap.light;
    link.href = faviconPath;
  }, [resolvedTheme]);

  return null; // This component doesn't render anything
};
