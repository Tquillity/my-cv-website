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

async function migrateI18n() {
  try {
    console.log("🌍 Starting i18n Migration (Swedish)...\n");

    // Read Swedish data files
    const portfolioDataSvPath = path.join(__dirname, '../src/data/portfolioData-sv.json');
    const cvDataSvPath = path.join(__dirname, '../src/data/cv-data-sv.json');
    const legacyCvDataSvPath = path.join(__dirname, '../src/data/legacy-cv-data-sv.json');

    const portfolioDataSv = JSON.parse(fs.readFileSync(portfolioDataSvPath, 'utf-8'));
    const cvDataSv = JSON.parse(fs.readFileSync(cvDataSvPath, 'utf-8'));
    const legacyCvDataSv = JSON.parse(fs.readFileSync(legacyCvDataSvPath, 'utf-8'));

    // ============================================
    // 1. MIGRATE PROJECTS
    // ============================================
    console.log("📦 Migrating Projects...");
    for (const p of portfolioDataSv.projects) {
      // Match by English title (we need to find the English name)
      // Since Swedish data has "name" field, we need to match by ID or find a way to match
      // Let's try matching by ID first (if we stored it), or by slug pattern
      
      // Try matching by checking if the project exists with a similar slug or by fetching all and matching
      // For now, let's fetch all projects and match by checking if the Swedish name corresponds
      // Actually, we should match by the English title - let's read the English file to get the mapping
      const portfolioDataEnPath = path.join(__dirname, '../src/data/portfolioData.json');
      const portfolioDataEn = JSON.parse(fs.readFileSync(portfolioDataEnPath, 'utf-8'));
      const englishProject = portfolioDataEn.projects.find(ep => ep.id === p.id);
      
      if (!englishProject) {
        console.log(`   ⚠️  Skipping ${p.name} - no English match found`);
        continue;
      }

      // Match Sanity project by English title
      const match = await client.fetch(
        `*[_type == "project" && title == $title][0]`,
        { title: englishProject.name }
      );

      if (match) {
        console.log(`   ✅ Found: ${englishProject.name} -> ${p.name}`);
        
        const updateData = {
          title_sv: p.name,
          description_sv: p.description,
        };

        // Add case study translations if they exist
        if (p.caseStudy) {
          if (p.caseStudy.problem) {
            updateData['caseStudy.problem_sv'] = p.caseStudy.problem;
          }
          if (p.caseStudy.solution) {
            updateData['caseStudy.solution_sv'] = p.caseStudy.solution;
          }
          // Add architecture description translation
          if (p.caseStudy.architecture?.description) {
            updateData['caseStudy.architecture.description_sv'] = p.caseStudy.architecture.description;
          }
        }

        // Build patch operation
        let patch = client.patch(match._id).set(updateData);

        // Handle technical challenges translations (arrays require special handling)
        if (p.caseStudy?.technicalChallenges && Array.isArray(p.caseStudy.technicalChallenges) && match.caseStudy?.technicalChallenges) {
          const updatedChallenges = match.caseStudy.technicalChallenges.map((existingChallenge, index) => {
            const svChallenge = p.caseStudy.technicalChallenges[index];
            if (svChallenge) {
              return {
                ...existingChallenge,
                title_sv: svChallenge.title || existingChallenge.title_sv,
                description_sv: svChallenge.description || existingChallenge.description_sv,
              };
            }
            return existingChallenge;
          });
          patch = patch.set({ 'caseStudy.technicalChallenges': updatedChallenges });
        }

        // Handle code snippets translations (arrays require special handling)
        if (p.caseStudy?.codeSnippets && Array.isArray(p.caseStudy.codeSnippets) && match.caseStudy?.codeSnippets) {
          const updatedSnippets = match.caseStudy.codeSnippets.map((existingSnippet, index) => {
            const svSnippet = p.caseStudy.codeSnippets[index];
            if (svSnippet) {
              return {
                ...existingSnippet,
                title_sv: svSnippet.title || existingSnippet.title_sv,
                description_sv: svSnippet.description || existingSnippet.description_sv,
              };
            }
            return existingSnippet;
          });
          patch = patch.set({ 'caseStudy.codeSnippets': updatedSnippets });
        }

        // Handle tag translations (match by English tag name and update name_sv and description_sv)
        if (p.tags && Array.isArray(p.tags) && match.tags && Array.isArray(match.tags)) {
          // Read English project to match tags by name
          const portfolioDataEnPath = path.join(__dirname, '../src/data/portfolioData.json');
          const portfolioDataEn = JSON.parse(fs.readFileSync(portfolioDataEnPath, 'utf-8'));
          const englishProject = portfolioDataEn.projects.find(ep => ep.id === p.id);
          
          if (englishProject && englishProject.tags) {
            // Create a map of Swedish tags by matching with English tags
            // Handle both string arrays and object arrays
            const updatedTags = match.tags.map((existingTag) => {
              // First, try to find matching Swedish tag by name (not by index)
              const svTagMatch = p.tags.find((svTag) => {
                const svTagName = typeof svTag === 'object' ? svTag.name : svTag;
                return svTagName === existingTag.name;
              });
              
              // If found by name match, use it
              if (svTagMatch) {
                if (typeof svTagMatch === 'string') {
                  return {
                    ...existingTag,
                    name_sv: svTagMatch,
                    description_sv: existingTag.description_sv || undefined
                  };
                } else if (typeof svTagMatch === 'object' && svTagMatch.name) {
                  return {
                    ...existingTag,
                    name_sv: svTagMatch.name || existingTag.name_sv,
                    description_sv: svTagMatch.description || existingTag.description_sv || undefined
                  };
                }
              }
              
              // Fallback: try to match by English tag index (for backwards compatibility)
              const enTagIndex = englishProject.tags.findIndex((enTag) => {
                const enTagName = typeof enTag === 'object' ? enTag.name : enTag;
                return enTagName === existingTag.name;
              });
              
              if (enTagIndex >= 0 && enTagIndex < p.tags.length) {
                const svTag = p.tags[enTagIndex];
                
                // Handle Swedish tag - could be string or object
                if (svTag) {
                  if (typeof svTag === 'string') {
                    return {
                      ...existingTag,
                      name_sv: svTag,
                      description_sv: existingTag.description_sv || undefined
                    };
                  } else if (typeof svTag === 'object' && svTag.name) {
                    return {
                      ...existingTag,
                      name_sv: svTag.name || existingTag.name_sv,
                      description_sv: svTag.description || existingTag.description_sv || undefined
                    };
                  }
                }
              }
              
              // If no Swedish tag match, preserve existing tag as-is
              return existingTag;
            });
            patch = patch.set({ tags: updatedTags });
            const tagsWithSv = updatedTags.filter(t => t.name_sv).length;
            console.log(`   -> Updated ${tagsWithSv}/${updatedTags.length} tags with Swedish translations`);
          }
        }

        await patch.commit();
        console.log(`   ✅ Patched ${englishProject.name} with Swedish translations`);
      } else {
        console.log(`   ⚠️  No Sanity match found for: ${englishProject.name}`);
      }
    }

    // ============================================
    // 2. MIGRATE EXPERIENCES
    // ============================================
    console.log("\n💼 Migrating Experiences...");
    
    // First, migrate primary experiences from cv-data-sv.json
    for (const exp of cvDataSv.experiences) {
      // Match by company and startDate
      const match = await client.fetch(
        `*[_type == "experience" && company == $company && startDate == $startDate][0]`,
        { 
          company: exp.company,
          startDate: exp.startDate || String(exp.startYear)
        }
      );

      if (match) {
        console.log(`   ✅ Found: ${exp.company} - ${exp.title}`);
        
        await client.patch(match._id).set({
          title_sv: exp.title,
          description_sv: exp.description
        }).commit();
        
        console.log(`   ✅ Patched experience at ${exp.company}`);
      } else {
        console.log(`   ⚠️  No Sanity match found for: ${exp.company} (${exp.startDate || exp.startYear})`);
      }
    }
    
    // Second, migrate legacy experiences from legacy-cv-data-sv.json
    console.log("\n📜 Migrating Legacy Experiences...");
    
    // Read English legacy data to match company names correctly
    const legacyCvDataEnPathForExp = path.join(__dirname, '../src/data/legacy-cv-data.json');
    const legacyCvDataEnForExp = JSON.parse(fs.readFileSync(legacyCvDataEnPathForExp, 'utf-8'));
    
    // Create a map of Swedish company names to English company names by index
    const companyNameMap = {};
    legacyCvDataSv.legacyExperience.forEach((svExp, index) => {
      const enExp = legacyCvDataEnForExp.legacyExperience[index];
      if (enExp) {
        companyNameMap[svExp.company] = enExp.company;
      }
    });
    
    for (const exp of legacyCvDataSv.legacyExperience || []) {
      // Try to match using English company name first (since Sanity has English names)
      const englishCompanyName = companyNameMap[exp.company] || exp.company;
      
      // Match by company and startDate
      let match = await client.fetch(
        `*[_type == "experience" && company == $company && startDate == $startDate][0]`,
        { 
          company: englishCompanyName,
          startDate: exp.startDate
        }
      );
      
      // If not found, try with Swedish company name
      if (!match) {
        match = await client.fetch(
          `*[_type == "experience" && company == $company && startDate == $startDate][0]`,
          { 
            company: exp.company,
            startDate: exp.startDate
          }
        );
      }

      if (match) {
        console.log(`   ✅ Found legacy: ${match.company} - ${exp.title}`);
        
        await client.patch(match._id).set({
          title_sv: exp.title,
          description_sv: exp.description
        }).commit();
        
        console.log(`   ✅ Patched legacy experience at ${match.company}`);
      } else {
        console.log(`   ⚠️  No Sanity match found for legacy: ${exp.company} (${exp.startDate})`);
      }
    }

    // ============================================
    // 3. MIGRATE EDUCATION
    // ============================================
    console.log("\n🎓 Migrating Education...");
    // Read English CV data to match by index/startDate
    const cvDataEnPath = path.join(__dirname, '../src/data/cv-data-en.json');
    const cvDataEn = JSON.parse(fs.readFileSync(cvDataEnPath, 'utf-8'));
    
    // Migrate primary education
    for (let i = 0; i < cvDataSv.education.length; i++) {
      const eduSv = cvDataSv.education[i];
      const eduEn = cvDataEn.education[i];
      
      if (!eduEn) {
        console.log(`   ⚠️  No English match found for index ${i}: ${eduSv.institution}`);
        continue;
      }

      // Match by English institution name and startDate
      // Try exact match first
      let match = await client.fetch(
        `*[_type == "education" && institution == $institution && startDate == $startDate][0]`,
        { 
          institution: eduEn.institution,
          startDate: eduEn.startDate || String(eduEn.startYear)
        }
      );

      // If no exact match, try matching by institution name only (in case date format differs)
      if (!match) {
        match = await client.fetch(
          `*[_type == "education" && institution == $institution][0]`,
          { 
            institution: eduEn.institution
          }
        );
      }

      // If still no match, try matching by startDate only (in case institution name differs slightly)
      if (!match && eduEn.startDate) {
        match = await client.fetch(
          `*[_type == "education" && startDate == $startDate][0]`,
          { 
            startDate: eduEn.startDate
          }
        );
      }

      if (match) {
        console.log(`   ✅ Found: ${match.institution} -> ${eduSv.institution}`);
        
        await client.patch(match._id).set({
          degree_sv: eduSv.degree,
          description_sv: eduSv.description || undefined
        }).commit();
        
        console.log(`   ✅ Patched education at ${match.institution}`);
      } else {
        console.log(`   ⚠️  No Sanity match found for: ${eduEn.institution} (${eduEn.startDate || eduEn.startYear}) - Entry may not exist in Sanity yet`);
      }
    }
    
    // Migrate legacy education
    console.log("\n📜 Migrating Legacy Education...");
    const legacyCvDataEnPath = path.join(__dirname, '../src/data/legacy-cv-data.json');
    const legacyCvDataEn = JSON.parse(fs.readFileSync(legacyCvDataEnPath, 'utf-8'));
    
    for (let i = 0; i < legacyCvDataSv.legacyEducation.length; i++) {
      const eduSv = legacyCvDataSv.legacyEducation[i];
      const eduEn = legacyCvDataEn.legacyEducation[i];
      
      if (!eduEn) {
        console.log(`   ⚠️  No English match found for legacy index ${i}: ${eduSv.institution}`);
        continue;
      }

      // Match by English institution name and startDate
      let match = await client.fetch(
        `*[_type == "education" && institution == $institution && startDate == $startDate][0]`,
        { 
          institution: eduEn.institution,
          startDate: eduEn.startDate
        }
      );

      if (match) {
        console.log(`   ✅ Found legacy: ${match.institution} -> ${eduSv.institution}`);
        
        await client.patch(match._id).set({
          degree_sv: eduSv.degree,
          description_sv: eduSv.description || undefined
        }).commit();
        
        console.log(`   ✅ Patched legacy education at ${match.institution}`);
      } else {
        console.log(`   ⚠️  No Sanity match found for legacy: ${eduEn.institution} (${eduEn.startDate}) - Entry may not exist in Sanity yet`);
      }
    }

    // ============================================
    // 4. MIGRATE PROFILE (SkillSet)
    // ============================================
    console.log("\n👤 Migrating Profile (SkillSet)...");
    const skillSet = await client.fetch(`*[_type == "skillSet"][0]`);

    if (skillSet) {
      console.log(`   ✅ Found SkillSet document`);
      
      await client.patch(skillSet._id).set({
        bio_sv: cvDataSv.personalInfo.objective
      }).commit();
      
      console.log(`   ✅ Patched SkillSet with Swedish bio`);
    } else {
      console.log(`   ⚠️  No SkillSet document found in Sanity`);
    }

    console.log("\n✅ i18n Migration Complete!");

  } catch (error) {
    console.error("❌ Migration Failed:", error.message);
    console.error(error);
    process.exit(1);
  }
}

migrateI18n();
