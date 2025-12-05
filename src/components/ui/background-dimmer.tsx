"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const BackgroundDimmer = () => {
  const pathname = usePathname();

  // Robust check for Home page (handling locales)
  // If path is exactly "/" or "/en" or "/sv" (or trailing slashes)
  const isHome = pathname === "/" || /^\/(en|sv)\/?$/.test(pathname);

  return (
    <div
      className={cn(
        "fixed inset-0 pointer-events-none transition-colors duration-700 ease-in-out -z-[5]",
        isHome ? "bg-background/0" : "bg-background/80" // UPDATED: Semantic background color
      )}
    />
  );
};
