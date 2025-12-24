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
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function updateExperiences() {
  try {
    console.log("🚀 Starting Experience Data Update...\n");

    // Read local data - both primary and legacy
    const cvDataPath = path.join(__dirname, '../src/data/cv-data-en.json');
    const legacyCvDataPath = path.join(__dirname, '../src/data/legacy-cv-data.json');
    
    const rawData = fs.readFileSync(cvDataPath, 'utf-8');
    const { experiences } = JSON.parse(rawData);
    
    // Read legacy experiences (English)
    let legacyExperiences = [];
    try {
      const legacyData = fs.readFileSync(legacyCvDataPath, 'utf-8');
      const parsed = JSON.parse(legacyData);
      legacyExperiences = parsed.legacyExperience || [];
      console.log(`   -> Loaded ${legacyExperiences.length} legacy experiences\n`);
    } catch (e) {
      console.log(`   -> ⚠️  Could not load legacy data: ${e.message}\n`);
    }

    // Combine primary and legacy experiences
    const allExperiences = [...experiences, ...legacyExperiences];

    for (const exp of allExperiences) {
      console.log(`Processing: ${exp.company} - ${exp.title}...`);

      // Find existing experience by company and startDate with retry logic
      let existing = null;
      let retries = 3;
      while (retries > 0 && !existing) {
        try {
          existing = await Promise.race([
            client.fetch(
              `*[_type == "experience" && company == $company && startDate == $startDate][0]`,
              { 
                company: exp.company,
                startDate: exp.startDate
              }
            ),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
          ]);
        } catch (error) {
          if (error.message === 'Timeout' && retries > 1) {
            console.log(`   -> Timeout, retrying... (${retries - 1} attempts left)`);
            retries--;
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
            continue;
          }
          throw error;
        }
        break;
      }

      if (existing) {
        console.log(`   -> Found existing (ID: ${existing._id}). Updating...`);
        
        await client.patch(existing._id).set({
          title: exp.title,
          company: exp.company,
          startDate: exp.startDate,
          endDate: exp.endDate || null,
          isCurrent: exp.isCurrent || false, // Ensure no "Present" dates
          description: exp.description,
          skills: exp.skills || [],
          isProminent: exp.isProminent !== undefined ? exp.isProminent : true // Use isProminent from data, default to true
        }).commit();
        
        console.log(`   -> ✅ Updated ${exp.company}`);
      } else {
        console.log(`   -> Not found. Creating new entry...`);
        
        const doc = {
          _type: 'experience',
          title: exp.title,
          company: exp.company,
          startDate: exp.startDate,
          endDate: exp.endDate || null,
          isCurrent: exp.isCurrent || false, // Ensure no "Present" dates
          description: exp.description,
          skills: exp.skills || [],
          isProminent: exp.isProminent !== undefined ? exp.isProminent : true // Use isProminent from data, default to true
        };
        
        await client.create(doc);
        console.log(`   -> ✅ Created ${exp.company}`);
      }
    }

    console.log("\n✅ Experience Update Complete!");

  } catch (error) {
    console.error("❌ Update Failed:", error.message);
    process.exit(1);
  }
}

updateExperiences();

