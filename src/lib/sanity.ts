import { createClient } from "next-sanity";
import createImageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "mock",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false, // Turn off for dev to see draft changes immediately
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  if (!source || !source.asset) {
    return undefined; 
  }
  return builder.image(source);
}
