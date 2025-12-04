import { client } from "./sanity";
import { Project, Experience, Education, SkillSet } from "@/types";

// Mock Data Fallback
const MOCK_PROJECTS: Project[] = [
  {
    _id: "mock-1",
    title: "MOCK DATA - CV Website",
    slug: { current: "my-cv-website" },
    mainImage: "", 
    description: "This is MOCK data. If you see this, Sanity connection failed.",
    tags: ["Mock", "Data"],
    publishedAt: "2024-01-01",
  }
];

const MOCK_EXPERIENCE: Experience[] = [
  {
    _id: "mock-1",
    company: "MOCK Company",
    title: "MOCK Developer",
    startDate: "2022-01-01",
    isCurrent: true,
    description: "This is MOCK data.",
    skills: ["Mocking"],
  }
];

export async function getProjects(): Promise<Project[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.log("⚠️ [DATA] No Project ID. Using MOCK data.");
    return MOCK_PROJECTS;
  }

  try {
    const data = await client.fetch(`*[_type == "project"] | order(publishedAt desc)`);
    console.log(`✅ [DATA] Successfully fetched ${data.length} Projects from Sanity.`);
    return data;
  } catch (error) {
    console.error("❌ [DATA] Sanity Fetch Failed. Using MOCK data.", error);
    return MOCK_PROJECTS;
  }
}

export async function getExperiences(): Promise<Experience[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.log("⚠️ [DATA] No Project ID. Using MOCK data.");
    return MOCK_EXPERIENCE;
  }

  try {
    const data = await client.fetch(`*[_type == "experience"] | order(startDate desc)`);
    console.log(`✅ [DATA] Successfully fetched ${data.length} Experiences from Sanity.`);
    return data;
  } catch (error) {
    console.error("❌ [DATA] Sanity Fetch Failed. Using MOCK data.", error);
    return MOCK_EXPERIENCE;
  }
}

export async function getEducation(): Promise<Education[]> {
  try {
    const data = await client.fetch(`*[_type == "education"] | order(startDate desc)`);
    console.log(`✅ [DATA] Fetched ${data.length} Education entries.`);
    return data;
  } catch (error) {
    console.error("❌ [DATA] Failed to fetch Education:", error);
    return [];
  }
}

export async function getProfile(): Promise<SkillSet | null> {
  try {
    const data = await client.fetch(`*[_type == "skillSet"][0]`);
    console.log(`✅ [DATA] Fetched Profile/Skills.`);
    return data;
  } catch (error) {
    console.error("❌ [DATA] Failed to fetch Profile:", error);
    return null;
  }
}
