import { createClient } from "next-sanity";

// Use require to bypass strict ESM export checks that are failing the build
const imageUrlBuilder = require('@sanity/image-url');

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "mock",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false, // Turn off for dev to see draft changes immediately
});

// Handle both default export and named export patterns
const builder = imageUrlBuilder.default 
  ? imageUrlBuilder.default(client) 
  : imageUrlBuilder(client);

export function urlFor(source: any) {
  // Defensive check: return a dummy builder-like object or null if source is missing
  if (!source || !source.asset) {
    return {
      width: () => ({ height: () => ({ url: () => null }) })
    };
  }
  return builder.image(source);
}
