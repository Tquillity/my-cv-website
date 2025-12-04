import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import cvData from "@/data/cv-data-en.json";

// Specialized Write Client
const migrationClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

export async function GET() {
  if (!process.env.SANITY_API_TOKEN) {
    return NextResponse.json({ error: "Missing SANITY_API_TOKEN" }, { status: 500 });
  }

  try {
    const mutations = [];

    // 1. Education
    for (const edu of cvData.education) {
      mutations.push(
        migrationClient.createOrReplace({
          _id: `education-${edu.startYear}`,
          _type: "education",
          institution: edu.institution,
          degree: edu.degree,
          startDate: `${edu.startYear}-01-01`,
          endDate: `${edu.endYear}-01-01`,
          description: edu.description,
        })
      );
    }

    // 2. SkillSet (Singleton-like document)
    mutations.push(
      migrationClient.createOrReplace({
        _id: "main-skillset",
        _type: "skillSet",
        title: "Main Skills",
        bio: cvData.personalInfo.objective,
        skills: cvData.skills,
        languages: cvData.languages,
      })
    );

    await Promise.all(mutations);

    return NextResponse.json({
      success: true,
      message: `Seeded ${cvData.education.length} education records and SkillSet.`,
    });
  } catch (error: any) {
    console.error("Seed Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
