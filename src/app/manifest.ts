import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function manifest(): MetadataRoute.Manifest {
  const base = getSiteUrl();

  return {
    name: "Mikael Sundh Portfolio",
    short_name: "Mikael Sundh",
    description: "Fullstack Engineer portfolio (Next.js, React, 3D, AI).",
    start_url: "/en",
    display: "standalone",
    background_color: "#0b0b0b",
    theme_color: "#0b0b0b",
    icons: [
      {
        src: new URL("/logos/logo192.png", base).pathname,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: new URL("/logos/logo512.png", base).pathname,
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: new URL("/logos/favicon.ico", base).pathname,
        sizes: "64x64 32x32 24x24 16x16",
        type: "image/x-icon",
      },
    ],
  };
}


