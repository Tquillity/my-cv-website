import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const locales = ["en", "sv"] as const;
  const paths = ["", "/portfolio", "/about"] as const;

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of paths) {
      const url = new URL(`/${locale}${path}`, base).toString();
      entries.push({
        url,
        lastModified: now,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : path === "/portfolio" ? 0.9 : 0.8,
      });
    }
  }

  return entries;
}


