import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Initialize Sanity Client with WRITE access
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN, // Requires 'Editor' or 'Write' permissions
  useCdn: false,
});

async function deleteProjects() {
  try {
    console.log("🗑️  Starting Project Deletion...");

    const projectsToDelete = ["Weather App", "Smart Contract Wallet"];

    for (const projectName of projectsToDelete) {
      console.log(`\nProcessing: ${projectName}...`);

      // Find the project by title
      const existing = await client.fetch(
        `*[_type == "project" && title == $title][0]`,
        { title: projectName }
      );

      if (existing) {
        console.log(`   -> Found (ID: ${existing._id}). Deleting...`);
        await client.delete(existing._id);
        console.log(`   ✅ Deleted successfully!`);
      } else {
        console.log(`   -> Not found. Skipping...`);
      }
    }

    console.log("\n✅ Deletion Complete!");

  } catch (error) {
    console.error("❌ Deletion Failed:", error.message);
    process.exit(1);
  }
}

deleteProjects();
