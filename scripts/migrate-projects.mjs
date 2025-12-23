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

      // 1. Handle Main Image
      let mainImageAssetId = null;
      const isPlaceholder = !project.image || project.image.includes('comingsoon');

      if (!isPlaceholder) {
        const cleanPath = project.image.startsWith('/') ? project.image.slice(1) : project.image;
        const imagePath = path.join(__dirname, '../public', cleanPath);
        
        if (fs.existsSync(imagePath)) {
          console.log(`   -> Uploading High-Res Asset: ${cleanPath}`);
          try {
            const asset = await client.assets.upload('image', fs.createReadStream(imagePath), {
              filename: path.basename(imagePath)
            });
            mainImageAssetId = asset._id;
            console.log(`   -> Main Image uploaded (ID: ${asset._id})`);
          } catch (err) {
            console.error(`   -> Asset upload failed: ${err.message}`);
          }
        } else {
          console.log(`   -> Skipping: File not found at ${imagePath}`);
        }
      } else {
        console.log(`   -> Skipping Image: Project is using Dynamic Placeholder.`);
      }

      // 2. Handle Additional Images
      let additionalImageAssets = [];
      if (project.additionalImages && project.additionalImages.length > 0) {
        for (const img of project.additionalImages) {
          const isImgPlaceholder = !img || img.includes('comingsoon');
          if (isImgPlaceholder) continue;

          const cleanPath = img.startsWith('/') ? img.slice(1) : img;
          const imagePath = path.join(__dirname, '../public', cleanPath);
          if (fs.existsSync(imagePath)) {
            console.log(`   -> Uploading Gallery Image: ${cleanPath}`);
            try {
              const asset = await client.assets.upload('image', fs.createReadStream(imagePath), {
                filename: path.basename(imagePath)
              });
              additionalImageAssets.push({
                _type: 'image',
                _key: asset._id.substring(0, 20), // Use part of asset ID as key
                asset: { _type: 'reference', _ref: asset._id }
              });
              console.log(`   -> Gallery Image uploaded (ID: ${asset._id})`);
            } catch (err) {
              console.error(`   -> Failed to upload gallery image: ${err.message}`);
            }
          } else {
            console.log(`   -> Gallery image file not found at: ${imagePath}`);
          }
        }
      }

      // Prepare the Case Study object
      let caseStudyData = undefined;
      if (project.caseStudy) {
        caseStudyData = {
          problem: project.caseStudy.problem,
          solution: project.caseStudy.solution,
          architecture: project.caseStudy.architecture ? {
            description: project.caseStudy.architecture.description,
            diagramType: project.caseStudy.architecture.diagramType
          } : undefined,
          technicalChallenges: (project.caseStudy.technicalChallenges || []).map(c => ({
            _key: c.title.substring(0, 10).replace(/\s/g, ''),
            title: c.title,
            description: c.description
          })),
          codeSnippets: (project.caseStudy.codeSnippets || []).map(s => ({
            _key: s.title.substring(0, 10).replace(/\s/g, ''),
            title: s.title,
            language: s.language,
            description: s.description,
            code: s.code
          }))
        };
        
        // Sanitize versionNotes keys (replace dots with underscores for Sanity compatibility)
        if (project.caseStudy.versionNotes) {
          const sanitizedVersionNotes = {};
          for (const [version, note] of Object.entries(project.caseStudy.versionNotes)) {
            // Sanitize key: "v6.1" -> "v6_1"
            const sanitizedKey = version.replace(/\./g, '_');
            sanitizedVersionNotes[sanitizedKey] = note;
          }
          caseStudyData.versionNotes = sanitizedVersionNotes;
        }
      }

      // Prepare tags array (Objects with name/description -> Objects with proper keys)
      let tagObjects = [];

      if (project.tags && project.tags.length > 0) {
        // If tags are already objects (new format), use them directly
        if (typeof project.tags[0] === 'object' && project.tags[0].name) {
          tagObjects = project.tags.map(tagObj => ({
            _key: tagObj.name.replace(/\s+/g, '-').toLowerCase(),
            name: tagObj.name,
            description: tagObj.description || undefined
          }));
        } else {
          // If tags are still strings (old format), convert them
          const uniqueTags = [...new Set([
            ...(project.tags || []),
            ...(project.languages || [])
          ])];

          tagObjects = uniqueTags.map(tagName => ({
            _key: tagName.replace(/\s+/g, '-').toLowerCase(),
            name: tagName,
            description: undefined
          }));
        }
      } else if (project.languages && project.languages.length > 0) {
        // Fallback to languages if no tags
        tagObjects = project.languages.map(lang => ({
          _key: lang.replace(/\s+/g, '-').toLowerCase(),
          name: lang,
          description: undefined
        }));
      }

      // Prepare document data for creation
      const liveUrlValue = project.liveUrl || project.liveVersion;
      
      // Prepare downloads object with versionHistory if it exists
      // Sanitize version keys (replace dots with underscores for Sanity compatibility)
      let downloadsData = undefined;
      if (project.downloads) {
        downloadsData = { ...project.downloads };
        if (project.downloads.versionHistory) {
          const sanitizedVersionHistory = {};
          for (const [version, data] of Object.entries(project.downloads.versionHistory)) {
            // Sanitize key: "v6.1" -> "v6_1"
            const sanitizedKey = version.replace(/\./g, '_');
            sanitizedVersionHistory[sanitizedKey] = data;
          }
          downloadsData.versionHistory = sanitizedVersionHistory;
        }
      }
      
      const doc = {
        _type: 'project',
        title: project.name,
        slug: { _type: 'slug', current: project.name.toLowerCase().replace(/\s+/g, '-') },
        description: project.description,
        tags: tagObjects,
        githubUrl: project.githubRepo,
        liveUrl: liveUrlValue,
        publishedAt: project.startDate,
        ...(downloadsData && { downloads: downloadsData }),
        ...(caseStudyData && { caseStudy: caseStudyData }),
        ...(mainImageAssetId && { mainImage: { _type: 'image', asset: { _type: 'reference', _ref: mainImageAssetId } } }),
        ...(additionalImageAssets.length > 0 && { additionalImages: additionalImageAssets })
      };

      if (existing) {
        console.log(`   -> Found existing (ID: ${existing._id}). Updating...`);
        // Build up all update fields in a single object to ensure all changes are applied
        const updateData = {
          liveUrl: liveUrlValue,
          tags: tagObjects,
          description: project.description,
        };
        
        // Add downloads (including versionHistory) if provided
        if (downloadsData) {
          updateData.downloads = downloadsData;
        }
        
        // Add case study (including versionNotes) if provided
        if (caseStudyData) {
          updateData.caseStudy = caseStudyData;
        }
        
        // Add images if provided
        if (mainImageAssetId) {
          updateData.mainImage = { _type: 'image', asset: { _type: 'reference', _ref: mainImageAssetId } };
        }
        if (additionalImageAssets.length > 0) {
          updateData.additionalImages = additionalImageAssets;
        }
        
        // Apply all updates in a single .set() call to ensure all fields are updated
        await client.patch(existing._id).set(updateData).commit();
        console.log(`   -> ✅ Updated ${project.name}`);
      } else {
        console.log(`   -> Not found. Creating new entry...`);
        await client.create(doc);
        console.log(`   -> ✅ Created ${project.name}`);
      }
    }

    console.log("✅ Safe Migration Complete!");

  } catch (error) {
    console.error("❌ Migration Failed:", error.message);
    process.exit(1);
  }
}

migrate();
