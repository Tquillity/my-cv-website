import { client } from "@/sanity/lib/client";
import { Project, Experience, Education, SkillSet, Tag } from "@/types";
import cvData from "../data/cv-data-en.json";
import portfolioData from "../data/portfolioData.json";

// Helper to convert string arrays to Tag objects
const normalizeTags = (tags: string[] = [], languages: string[] = []): Tag[] => {
  const uniqueNames = Array.from(new Set([...tags, ...languages]));
  return uniqueNames.map(name => ({
    name,
    description: undefined
  }));
};

// Mock Data / Local Data Fallback
const MOCK_PROJECTS: Project[] = portfolioData.projects.map((p: any) => ({
  _id: String(p.id),
  title: p.name,
  slug: { current: p.name.toLowerCase().replace(/\s+/g, '-') },
  mainImage: p.image ? (p.image.startsWith('/') ? p.image : `/${p.image}`) : "",
  additionalImages: (p.additionalImages || []).map((img: string) => 
    img.startsWith('/') ? img : `/${img}`
  ),
  description: p.description,
  tags: normalizeTags(p.tags, p.languages),
  githubUrl: p.githubRepo,
  liveUrl: p.liveUrl || p.liveVersion,
  publishedAt: p.startDate,
  caseStudy: p.caseStudy ? {
    problem: p.caseStudy.problem,
    solution: p.caseStudy.solution,
    architecture: p.caseStudy.architecture,
    technicalChallenges: p.caseStudy.technicalChallenges,
    codeSnippets: p.caseStudy.codeSnippets
  } : undefined,
  downloads: p.downloads
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
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return MOCK_PROJECTS;
  }

  try {
    const data = await client.fetch(
      `*[_type == "project"] | order(publishedAt desc)`,
      {},
      { next: { revalidate: 3600 } }
    );
    // Normalize liveUrl fallback for UI (support legacy liveVersion/live fields)
    return data.map((p: any) => ({
      ...p,
      liveUrl: p.liveUrl || p.liveVersion || p.live || (p.live && p.live.url),
    }));
  } catch (error) {
    console.error("Sanity fetch failed for projects, using mock data.", error);
    return MOCK_PROJECTS;
  }
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    const data = await client.fetch(
      `*[_type == "experience"] | order(startDate desc) {
      ...,
      "isProminent": coalesce(isProminent, true)
    }`,
      {},
      { next: { revalidate: 3600 } }
    );
    if (data && data.length > 0) {
      return data;
    }
    return MOCK_EXPERIENCE;
  } catch (error) {
    console.error("Sanity fetch failed for experiences, using mock data.", error);
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
      return data;
    }
    return MOCK_EDUCATION;
  } catch (error) {
    console.error("Sanity fetch failed for education, using mock data.", error);
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
        return MOCK_PROFILE;
    }
    return data;
  } catch (error) {
    console.error("Sanity fetch failed for profile, using mock data.", error);
    return MOCK_PROFILE;
  }
}
