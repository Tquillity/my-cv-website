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

async function migrate() {
  try {
    console.log("🚀 Starting Safe Data Migration...");

    // Read local data
    const dataPath = path.join(__dirname, '../src/data/portfolioData.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const { projects } = JSON.parse(rawData);

    for (const project of projects) {
      console.log(`Processing: ${project.name}...`);

      // 1. Check if project exists by Title (avoiding ID collisions)
      const existing = await client.fetch(
        `*[_type == "project" && title == $title][0]`,
        { title: project.name }
      );

      // Prepare Image Upload
      let imageAssetId = null;
      if (project.image && project.image.startsWith('/')) {
        const imagePath = path.join(__dirname, '../public', project.image);
        if (fs.existsSync(imagePath)) {
          // Check if we need to upload (skip if mainImage already exists to avoid duplicate uploads on every run)
          // Actually, let's upload if existing doesn't have an image OR if we want to ensure it matches local
          // For now, we'll upload if existing image is missing OR if we are forcing an update.
          // To be safe and efficient: upload only if we are patching or creating.
          // Since we want to update the image:
          console.log(`   -> Uploading image: ${project.image}...`);
          try {
            const asset = await client.assets.upload('image', fs.createReadStream(imagePath), {
              filename: path.basename(imagePath)
            });
            imageAssetId = asset._id;
            console.log(`   -> Image uploaded (ID: ${asset._id})`);
          } catch (err) {
            console.error(`   -> Failed to upload image: ${err.message}`);
          }
        } else {
            console.log(`   -> Image file not found at: ${imagePath}`);
        }
      }

      // Prepare the Case Study object
      const caseStudyData = project.caseStudy ? {
        problem: project.caseStudy.problem,
        solution: project.caseStudy.solution,
        architecture: {
          description: project.caseStudy.architecture.description,
          diagramType: project.caseStudy.architecture.diagramType
        },
        technicalChallenges: project.caseStudy.technicalChallenges.map(c => ({
          _key: c.title.substring(0, 10).replace(/\s/g, ''),
          title: c.title,
          description: c.description
        })),
        codeSnippets: project.caseStudy.codeSnippets.map(s => ({
          _key: s.title.substring(0, 10).replace(/\s/g, ''),
          title: s.title,
          language: s.language,
          description: s.description,
          code: s.code
        }))
      } : undefined;

      if (existing) {
        // UPDATE MODE: Only patch specific fields (Case Study + Links)
        // We DO NOT touch mainImage, description, or title to preserve CMS edits.
        console.log(`   -> Found existing (ID: ${existing._id}). Patching...`);

        await client.patch(existing._id)
          .set({
            ...(caseStudyData && { caseStudy: caseStudyData }), // Only set if exists
            githubUrl: project.githubRepo,
            liveUrl: project.liveVersion,
            tags: project.languages, // Updating tags as requested
            publishedAt: project.startDate, // Updating sort order
            ...(imageAssetId && { mainImage: { _type: 'image', asset: { _type: 'reference', _ref: imageAssetId } } })
          })
          .commit();

      } else {
        // CREATE MODE: Create new project if it doesn't exist
        console.log(`   -> Not found. Creating new entry...`);

        await client.create({
          _type: 'project',
          title: project.name,
          slug: { _type: 'slug', current: project.name.toLowerCase().replace(/\s+/g, '-') },
          description: project.description,
          tags: project.languages,
          githubUrl: project.githubRepo,
          liveUrl: project.liveVersion,
          publishedAt: project.startDate,
          ...(caseStudyData && { caseStudy: caseStudyData }),
          ...(imageAssetId && { mainImage: { _type: 'image', asset: { _type: 'reference', _ref: imageAssetId } } })
        });
      }
    }

    console.log("✅ Safe Migration Complete!");

  } catch (error) {
    console.error("❌ Migration Failed:", error.message);
    process.exit(1);
  }
}

migrate();