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

async function updateEducation() {
  try {
    console.log("🚀 Starting Education Data Update...\n");

    // Read local data - both primary and legacy
    const cvDataPath = path.join(__dirname, '../src/data/cv-data-en.json');
    const legacyCvDataPath = path.join(__dirname, '../src/data/legacy-cv-data.json');
    
    const rawData = fs.readFileSync(cvDataPath, 'utf-8');
    const { education } = JSON.parse(rawData);
    
    // Read legacy education (English)
    let legacyEducation = [];
    try {
      const legacyData = fs.readFileSync(legacyCvDataPath, 'utf-8');
      const parsed = JSON.parse(legacyData);
      legacyEducation = parsed.legacyEducation || [];
      console.log(`   -> Loaded ${legacyEducation.length} legacy education entries\n`);
    } catch (e) {
      console.log(`   -> ⚠️  Could not load legacy data: ${e.message}\n`);
    }

    // Combine primary and legacy education
    const allEducation = [...education, ...legacyEducation];

    for (const edu of allEducation) {
      console.log(`Processing: ${edu.institution} - ${edu.degree}...`);

      // Find existing education by institution and startDate with retry logic
      let existing = null;
      let retries = 3;
      while (retries > 0 && !existing) {
        try {
          existing = await Promise.race([
            client.fetch(
              `*[_type == "education" && institution == $institution && startDate == $startDate][0]`,
              { 
                institution: edu.institution,
                startDate: edu.startDate || String(edu.startYear)
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
          degree: edu.degree,
          institution: edu.institution,
          startDate: edu.startDate || String(edu.startYear),
          endDate: edu.endDate || String(edu.endYear) || null,
          description: edu.description || undefined
        }).commit();
        
        console.log(`   -> ✅ Updated ${edu.institution}`);
      } else {
        console.log(`   -> Not found. Creating new entry...`);
        
        const doc = {
          _type: 'education',
          degree: edu.degree,
          institution: edu.institution,
          startDate: edu.startDate || String(edu.startYear),
          endDate: edu.endDate || String(edu.endYear) || null,
          description: edu.description || undefined
        };
        
        await client.create(doc);
        console.log(`   -> ✅ Created ${edu.institution}`);
      }
    }

    console.log("\n✅ Education Update Complete!");

  } catch (error) {
    console.error("❌ Update Failed:", error.message);
    process.exit(1);
  }
}

updateEducation();

