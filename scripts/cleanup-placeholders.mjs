// scripts/cleanup-placeholders.mjs
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function cleanup() {
  const query = `*[_type == "project" && (title == "OmniComment" || title == "Video Course Platform")]`;
  const projects = await client.fetch(query);

  for (const project of projects) {
    console.log(`\u{1F9F9} Clearing placeholder image for: ${project.title}`);
    await client.patch(project._id).unset(['mainImage']).commit();
  }
  console.log("\u2705 Cleanup complete. Dynamic placeholders should now be visible.");
}
cleanup();

