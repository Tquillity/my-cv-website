import "server-only";
import { getSanityClient } from "@/sanity/lib/client";
import { Project, Experience, Education, SkillSet, Tag } from "@/types";
import cvDataEn from "../data/cv-data-en.json";
import cvDataSv from "../data/cv-data-sv.json";
import legacyEn from "../data/legacy-cv-data.json";
import legacySv from "../data/legacy-cv-data-sv.json";
import portfolioDataEn from "../data/portfolioData.json";
import portfolioDataSv from "../data/portfolioData-sv.json";

const getCvData = (locale: string) => (locale === "sv" ? cvDataSv : cvDataEn);
const getLegacyData = (locale: string) => (locale === "sv" ? legacySv : legacyEn);
const getPortfolioData = (locale: string) => (locale === "sv" ? portfolioDataSv : portfolioDataEn);

const getLocalizedValue = (en: string | undefined, sv: string | undefined, locale: string): string => {
  return (locale === 'sv' && sv) ? sv : (en || "");
};

const mapLocalProjects = (locale: string): Project[] => {
  const data = getPortfolioData(locale);
  return data.projects.map((p: any) => ({
    _id: String(p.id),
    title: p.name,
    slug: { 
      current: p.id === 1 ? "my-cv-website" : p.name.toLowerCase().replace(/\s+/g, '-') 
    },
    mainImage: p.image ? (p.image.startsWith('/') ? p.image : `/${p.image}`) : "",
    additionalImages: (p.additionalImages || []).map((img: string) => 
      img.startsWith('/') ? img : `/${img}`
    ),
    description: p.description,
    tags: (p.tags || []).map((t: any) => {
      const tagName = typeof t === 'string' ? t : t.name;
      const tagNameSv = typeof t === 'string' ? undefined : t.name_sv;
      const tagDesc = typeof t === 'string' ? undefined : t.description;
      const tagDescSv = typeof t === 'string' ? undefined : t.description_sv;
      return {
        name: getLocalizedValue(tagName, tagNameSv, locale),
        description: getLocalizedValue(tagDesc, tagDescSv, locale),
      };
    }),
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
};

const mapExperiences = (locale: string): Experience[] =>
  getCvData(locale).experiences.map((exp: any) => ({
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

const mapEducation = (locale: string): Education[] =>
  getCvData(locale).education.map((edu: any, index: number) => ({
    _id: `edu-${index}`,
    institution: edu.institution,
    degree: edu.degree,
    startDate: edu.startDate || String(edu.startYear),
    endDate: edu.endDate || String(edu.endYear),
    isProminent: edu.isProminent ?? true,
    description: edu.description,
  }));

const mapProfile = (locale: string): SkillSet => {
  const data = getCvData(locale);
  return {
    _id: "profile-1",
    bio: data.personalInfo.objective,
    skills: data.skills,
    languages: data.languages,
  };
};

export async function getProjects(locale: string = "en"): Promise<Project[]> {
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    try {
      const client = getSanityClient();
      if (!client) throw new Error("Sanity client unavailable");
      const data = await client.fetch(
        `*[_type == "project"] | order(publishedAt desc)`,
        {},
        { next: { revalidate: 3600 } }
      );
      if (data && data.length > 0) {
        return data.map((p: any) => {
          const liveObjUrl = typeof p.live === 'object' && p.live !== null ? p.live.url : undefined;
          return {
            ...p,
            title: getLocalizedValue(p.title, p.title_sv, locale),
            description: getLocalizedValue(p.description, p.description_sv, locale),
            liveUrl: p.liveUrl || p.liveVersion || liveObjUrl,
            tags: (p.tags || []).map((tag: any) => ({
              ...tag,
              name: getLocalizedValue(tag.name, tag.name_sv, locale),
              description: getLocalizedValue(tag.description, tag.description_sv, locale),
            })),
            caseStudy: p.caseStudy ? {
              ...p.caseStudy,
              problem: getLocalizedValue(p.caseStudy.problem, p.caseStudy.problem_sv, locale),
              solution: getLocalizedValue(p.caseStudy.solution, p.caseStudy.solution_sv, locale),
              architecture: p.caseStudy.architecture ? {
                ...p.caseStudy.architecture,
                description: getLocalizedValue(
                  p.caseStudy.architecture.description,
                  p.caseStudy.architecture.description_sv,
                  locale
                ),
                diagramType: p.caseStudy.architecture.diagramType,
              } : undefined,
              technicalChallenges: p.caseStudy.technicalChallenges?.map((challenge: any) => ({
                ...challenge,
                title: getLocalizedValue(challenge.title, challenge.title_sv, locale),
                description: getLocalizedValue(challenge.description, challenge.description_sv, locale),
              })),
              codeSnippets: p.caseStudy.codeSnippets?.map((snippet: any) => ({
                ...snippet,
                title: getLocalizedValue(snippet.title, snippet.title_sv, locale),
                description: getLocalizedValue(snippet.description, snippet.description_sv, locale),
              })),
            } : undefined,
          };
        });
      }
    } catch {}
  }

  return mapLocalProjects(locale);
}

export async function getExperiences(locale: string = "en"): Promise<Experience[]> {
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    try {
      const client = getSanityClient();
      if (!client) throw new Error("Sanity client unavailable");
      const sanityData = await client.fetch(
        `*[_type == "experience"] | order(startDate desc) {
        ...,
        "isProminent": coalesce(isProminent, true)
      }`,
        {},
        { next: { revalidate: 3600 } }
      );

      if (sanityData && sanityData.length > 0) {
        return sanityData.map((exp: any) => {
          const title = getLocalizedValue(exp.title, exp.title_sv, locale);
          const description = getLocalizedValue(exp.description, exp.description_sv, locale);

          return {
            ...exp,
            title,
            description,
          };
        });
      }
    } catch {}
  }

  const primaryLocal = mapExperiences(locale);
  
  const legacyFile = getLegacyData(locale);
  const legacyData = legacyFile.legacyExperience.map((exp: any) => ({
    _id: exp.id,
    company: exp.company,
    title: exp.title,
    startDate: exp.startDate,
    endDate: exp.endDate,
    isCurrent: false,
    isProminent: false,
    description: exp.description,
    skills: exp.skills
  }));

  return [...primaryLocal, ...legacyData];
}

export async function getEducation(locale: string = "en"): Promise<Education[]> {
  try {
    const client = getSanityClient();
    if (!client) throw new Error("Sanity client unavailable");
    const data = await client.fetch(
      `*[_type == "education"] | order(startDate desc) {
      ...,
      "isProminent": coalesce(isProminent, true)
    }`,
      {},
      { next: { revalidate: 3600 } }
    );
    if (data && data.length > 0) {
      return data.map((edu: any) => ({
        ...edu,
        degree: getLocalizedValue(edu.degree, edu.degree_sv, locale),
        description: getLocalizedValue(edu.description, edu.description_sv, locale),
      }));
    }
    return mapEducation(locale);
  } catch {
    return mapEducation(locale);
  }
}

export async function getProfile(locale: string = "en"): Promise<SkillSet | null> {
  try {
    const client = getSanityClient();
    if (!client) throw new Error("Sanity client unavailable");
    const data = await client.fetch(
      `*[_type == "skillSet"][0]`,
      {},
      { next: { revalidate: 3600 } }
    );
    if (!data) {
        return mapProfile(locale);
    }
    return {
      ...data,
      bio: getLocalizedValue(data.bio, data.bio_sv, locale),
    };
  } catch {
    return mapProfile(locale);
  }
}
