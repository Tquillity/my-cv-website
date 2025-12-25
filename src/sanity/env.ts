export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-12-04";

// IMPORTANT:
// - These env vars are optional at build/runtime for the main app because we support local JSON fallbacks.
// - The Studio route is separately protected; if env vars are missing and Studio is accessed, it may fail.
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

export const hasSanityEnv = Boolean(dataset && projectId);
