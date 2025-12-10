import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Sanity Client with WRITE access
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN, // Requires 'Editor' or 'Write' permissions
  useCdn: false,
});

async function migrateSkills() {
  try {
    console.log("🚀 Starting Skills Migration...");

    // Read English CV data (primary source for skills)
    const cvDataPath = path.join(__dirname, '../src/data/cv-data-en.json');
    const rawData = fs.readFileSync(cvDataPath, 'utf-8');
    const cvData = JSON.parse(rawData);

    if (!cvData.skills || !Array.isArray(cvData.skills)) {
      console.error("❌ No skills array found in CV data");
      process.exit(1);
    }

    console.log(`📋 Found ${cvData.skills.length} skills to migrate:`);
    cvData.skills.forEach((skill, idx) => {
      console.log(`   ${idx + 1}. ${skill}`);
    });

    // 1. Check if skillSet exists
    const existing = await client.fetch(
      `*[_type == "skillSet"][0]`
    );

    if (existing) {
      console.log(`\n✅ Found existing skillSet (ID: ${existing._id})`);
      console.log(`   Current skills count: ${existing.skills?.length || 0}`);
      console.log(`   Preserving bio and languages...`);
      
      // SAFE UPDATE: Only update the skills array, preserve everything else
      console.log(`\n🔄 Updating skills array...`);
      await client
        .patch(existing._id)
        .set({ skills: cvData.skills })
        .commit();
      
      console.log(`✅ Skills updated successfully!`);
      console.log(`   New skills count: ${cvData.skills.length}`);
    } else {
      console.log(`\n⚠️  No existing skillSet found. Creating new one...`);
      
      // Create new skillSet with all data from CV
      const newSkillSet = {
        _type: 'skillSet',
        title: 'My Skills',
        bio: cvData.personalInfo?.objective || '',
        skills: cvData.skills,
        languages: cvData.languages || []
      };
      
      const created = await client.create(newSkillSet);
      console.log(`✅ Created new skillSet (ID: ${created._id})`);
      console.log(`   Skills count: ${cvData.skills.length}`);
    }

    // Verify the update
    console.log(`\n🔍 Verifying update...`);
    const verified = await client.fetch(
      `*[_type == "skillSet"][0]`
    );
    
    if (verified && verified.skills) {
      console.log(`✅ Verification successful!`);
      console.log(`   Final skills count: ${verified.skills.length}`);
      console.log(`   Bio preserved: ${verified.bio ? 'Yes' : 'No'}`);
      console.log(`   Languages preserved: ${verified.languages?.length || 0}`);
    }

    console.log("\n✅ Skills Migration Complete!");

  } catch (error) {
    console.error("❌ Migration Failed:", error.message);
    console.error(error);
    process.exit(1);
  }
}

migrateSkills();
