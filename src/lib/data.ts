import { client } from "./sanity";
import { Project, Experience } from "@/types";

// Mock Data Fallback
const MOCK_PROJECTS: Project[] = [
  {
    _id: "1",
    title: "My CV Website",
    slug: { current: "my-cv-website" },
    mainImage: "/images/my-cv-website.webp",
    description: "A personal portfolio website built with Next.js 14 and Tailwind CSS.",
    tags: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    githubUrl: "https://github.com/digislinger/my-cv-website",
    publishedAt: "2024-01-01",
  },
  {
    _id: "2",
    title: "OmniComment",
    slug: { current: "omni-comment" },
    mainImage: "/images/OmniComment.webp",
    description: "A VS Code extension for generating code comments using AI.",
    tags: ["VS Code Extension", "TypeScript", "AI", "OpenAI"],
    publishedAt: "2023-12-01",
  },
];

const MOCK_EXPERIENCE: Experience[] = [
  {
    _id: "1",
    company: "Tech Innovators Inc.",
    title: "Senior Full-Stack Developer",
    startDate: "2022-01-01",
    isCurrent: true,
    description: "Leading a team of developers to build scalable web applications.",
    skills: ["React", "Node.js", "AWS", "TypeScript"],
  },
  {
    _id: "2",
    company: "Web Solutions Ltd.",
    title: "Frontend Developer",
    startDate: "2020-06-01",
    endDate: "2021-12-31",
    isCurrent: false,
    description: "Developed responsive user interfaces for e-commerce platforms.",
    skills: ["Vue.js", "JavaScript", "SASS"],
  },
];

export async function getProjects(): Promise<Project[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.warn("Sanity Project ID not found, using mock data for Projects.");
    return MOCK_PROJECTS;
  }

  try {
    const data = await client.fetch(`*[_type == "project"] | order(publishedAt desc)`);
    console.log(`[getProjects] Fetched ${data.length} projects`);
    return data;
  } catch (error) {
    console.error("[getProjects] Failed, using mock data:", error);
    return MOCK_PROJECTS;
  }
}

export async function getExperiences(): Promise<Experience[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.warn("Sanity Project ID not found, using mock data for Experience.");
    return MOCK_EXPERIENCE;
  }

  try {
    const data = await client.fetch(`*[_type == "experience"] | order(startDate desc)`);
    console.log(`[getExperiences] Fetched ${data.length} experiences`);
    return data;
  } catch (error) {
    console.error("[getExperiences] Failed, using mock data:", error);
    return MOCK_EXPERIENCE;
  }
}
