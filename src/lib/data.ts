import { client } from "./sanity";
import { Project, Experience, Education, SkillSet } from "@/types";
import cvData from "../data/cv-data-en.json";
import portfolioData from "../data/portfolioData.json";

// Mock Data / Local Data Fallback
const MOCK_PROJECTS: Project[] = portfolioData.projects.map((p: any) => ({
  _id: String(p.id),
  title: p.name,
  slug: { current: p.name.toLowerCase().replace(/\s+/g, '-') },
  mainImage: p.image || "",
  description: p.description,
  tags: p.languages || [], // Map languages to tags
  githubUrl: p.githubRepo,
  liveUrl: p.liveVersion,
  publishedAt: p.startDate,
  // NEW: Map the caseStudy object directly
  caseStudy: p.caseStudy ? {
    problem: p.caseStudy.problem,
    solution: p.caseStudy.solution,
    architecture: p.caseStudy.architecture,
    technicalChallenges: p.caseStudy.technicalChallenges,
    codeSnippets: p.caseStudy.codeSnippets
  } : undefined
}));

const MOCK_EXPERIENCE: Experience[] = cvData.experiences.map((exp: any) => ({
  _id: String(exp.id),
  company: exp.company,
  title: exp.title,
  startDate: exp.startDate || String(exp.startYear),
  endDate: exp.endDate || String(exp.endYear),
  isCurrent: exp.isCurrent || false,
  isProminent: exp.isProminent ?? true,
  description: exp.description,
  skills: exp.skills,
}));

const MOCK_EDUCATION: Education[] = cvData.education.map((edu: any, index: number) => ({
  _id: `edu-${index}`,
  institution: edu.institution,
  degree: edu.degree,
  startDate: edu.startDate || String(edu.startYear),
  endDate: edu.endDate || String(edu.endYear),
  isProminent: edu.isProminent ?? true,
  description: edu.description,
}));

const MOCK_PROFILE: SkillSet = {
  _id: "profile-1",
  bio: cvData.personalInfo.objective,
  skills: cvData.skills,
  languages: cvData.languages,
};

export async function getProjects(): Promise<Project[]> {
  // Use Sanity unless Project ID is completely missing from env

  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.log("⚠️ [DATA] No Project ID. Using MOCK data.");
    return MOCK_PROJECTS;
  }

  try {
    // Fetch from Sanity, ordered by date
    const data = await client.fetch(
      `*[_type == "project"] | order(publishedAt desc)`,
      {},
      { next: { revalidate: 3600 } }
    );
    console.log(`✅ [DATA] Successfully fetched ${data.length} Projects from Sanity.`);
    return data;
  } catch (error) {
    console.error("❌ [DATA] Sanity Fetch Failed. Using MOCK data.", error);
    return MOCK_PROJECTS;
  }
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    // Force local data to ensure dates are correct until Sanity is updated
    const data = await client.fetch(
      `*[_type == "experience"] | order(startDate desc) {
      ...,
      "isProminent": coalesce(isProminent, true)
    }`,
      {},
      { next: { revalidate: 3600 } }
    );
    if (data && data.length > 0) {
      console.log(`✅ [DATA] Successfully fetched ${data.length} Experiences from Sanity.`);
      return data;
    }
    console.log("⚠️ [DATA] Forcing local experience data to ensure correct dates.");
    return MOCK_EXPERIENCE;
  } catch (error) {
    console.error("❌ [DATA] Sanity Fetch Failed. Using MOCK data.", error);
    return MOCK_EXPERIENCE;
  }
}

export async function getEducation(): Promise<Education[]> {
  try {
    const data = await client.fetch(
      `*[_type == "education"] | order(startDate desc) {
      ...,
      "isProminent": coalesce(isProminent, true)
    }`,
      {},
      { next: { revalidate: 3600 } }
    );
    if (data && data.length > 0) {
      console.log(`✅ [DATA] Fetched ${data.length} Education entries from Sanity.`);
      return data;
    }
    console.log("⚠️ [DATA] Sanity Education empty. Using local data.");
    return MOCK_EDUCATION;
  } catch (error) {
    console.error("❌ [DATA] Failed to fetch Education:", error);
    return MOCK_EDUCATION;
  }
}

export async function getProfile(): Promise<SkillSet | null> {
  try {
    const data = await client.fetch(
      `*[_type == "skillSet"][0]`,
      {},
      { next: { revalidate: 3600 } }
    );
    if (!data) {
        console.log("⚠️ [DATA] Sanity Profile empty. Using local data.");
        return MOCK_PROFILE;
    }
    console.log(`✅ [DATA] Fetched Profile/Skills.`);
    return data;
  } catch (error) {
    console.error("❌ [DATA] Failed to fetch Profile:", error);
    return MOCK_PROFILE;
  }
}
