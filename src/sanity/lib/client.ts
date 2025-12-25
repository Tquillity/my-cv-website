import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, hasSanityEnv } from '../env'

export function getSanityClient() {
  if (!hasSanityEnv) return null;
  return createClient({
    projectId: projectId!,
    dataset: dataset!,
    apiVersion,
    useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
  });
}
