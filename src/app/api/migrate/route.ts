import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import portfolioData from "@/data/portfolioData.json";
import cvData from "@/data/cv-data-en.json";

// 1. Create a specialized Write Client (We don't use the standard one because it's read-only)
const migrationClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN, // <--- This uses the token you just added
  useCdn: false,
});

export async function GET() {
  if (!process.env.SANITY_API_TOKEN) {
    return NextResponse.json({ error: "Missing SANITY_API_TOKEN in .env.local" }, { status: 500 });
  }

  try {
    const mutations = [];

    // --- Prepare Experience Data ---
    for (const exp of cvData.experiences) {
      mutations.push(
        migrationClient.createOrReplace({
          _id: `experience-${exp.id}`, // Custom ID ensures we don't create duplicates if run twice
          _type: "experience",
          company: exp.company,
          title: exp.title,
          // Sanity expects YYYY-MM-DD for date fields
          startDate: `${exp.startYear}-01-01`, 
          endDate: exp.endYear ? `${exp.endYear}-01-01` : undefined,
          isCurrent: exp.endYear === 2025 || (exp as any).date?.toLowerCase().includes("present") || (exp as any).date?.toLowerCase().includes("pågående"),
          description: exp.description,
          skills: [], // Initialize empty, can be filled in Studio later
        })
      );
    }

    // --- Prepare Project Data ---
    for (const project of portfolioData.projects) {
      mutations.push(
        migrationClient.createOrReplace({
          _id: `project-${project.id}`,
          _type: "project",
          title: project.name,
          slug: { _type: "slug", current: project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
          description: project.description,
          tags: project.languages,
          githubUrl: project.githubRepo,
          liveUrl: project.liveVersion,
          publishedAt: project.startDate,
          // NOTE: We skip images here. Uploading binaries via script is fragile. 
          // It is faster to drag-and-drop them in the Studio UI once the text is there.
        })
      );
    }

    // 2. Execute all writes in parallel
    await Promise.all(mutations);

    return NextResponse.json({ 
      success: true, 
      message: `Migrated ${cvData.experiences.length} experiences and ${portfolioData.projects.length} projects.` 
    });

  } catch (error: any) {
    console.error("Migration Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}