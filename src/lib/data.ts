import { client } from "@/sanity/lib/client";
import { Project, Experience, Education, SkillSet, Tag } from "@/types";
import cvDataEn from "../data/cv-data-en.json";
import cvDataSv from "../data/cv-data-sv.json";
import legacyEn from "../data/legacy-cv-data.json";
import legacySv from "../data/legacy-cv-data-sv.json";
import portfolioDataEn from "../data/portfolioData.json";
import portfolioDataSv from "../data/portfolioData-sv.json";

// Helper functions to get locale-specific data
const getCvData = (locale: string) => (locale === "sv" ? cvDataSv : cvDataEn);
const getLegacyData = (locale: string) => (locale === "sv" ? legacySv : legacyEn);
const getPortfolioData = (locale: string) => (locale === "sv" ? portfolioDataSv : portfolioDataEn);

// Helper to select localized value from Sanity data
const getLocalizedValue = (en: string | undefined, sv: string | undefined, locale: string): string => {
  return (locale === 'sv' && sv) ? sv : (en || "");
};

// Local Data (offline fallback) - locale-aware
const mapLocalProjects = (locale: string): Project[] => {
  const data = getPortfolioData(locale);
  return data.projects.map((p: any) => ({
    _id: String(p.id),
    title: p.name,
    // ID 1 is always my-cv-website for code logic consistency regardless of locale
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
  // Try Sanity first (production source)
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    try {
      const data = await client.fetch(
        `*[_type == "project"] | order(publishedAt desc)`,
        {},
        { next: { revalidate: 3600 } }
      );
      // If Sanity has data, return it (normalize liveUrl fallback and apply localization)
      if (data && data.length > 0) {
        return data.map((p: any) => {
          const liveObjUrl = typeof p.live === 'object' && p.live !== null ? p.live.url : undefined;
          return {
            ...p,
            // Dynamic localization mapping
            title: getLocalizedValue(p.title, p.title_sv, locale),
            description: getLocalizedValue(p.description, p.description_sv, locale),
            liveUrl: p.liveUrl || p.liveVersion || liveObjUrl,
            // Localize tags
            tags: (p.tags || []).map((tag: any) => ({
              ...tag,
              name: getLocalizedValue(tag.name, tag.name_sv, locale),
              description: getLocalizedValue(tag.description, tag.description_sv, locale),
            })),
            // Localize case study if it exists
            caseStudy: p.caseStudy ? {
              ...p.caseStudy,
              problem: getLocalizedValue(p.caseStudy.problem, p.caseStudy.problem_sv, locale),
              solution: getLocalizedValue(p.caseStudy.solution, p.caseStudy.solution_sv, locale),
              // Localize architecture description
              architecture: p.caseStudy.architecture ? {
                ...p.caseStudy.architecture,
                description: getLocalizedValue(
                  p.caseStudy.architecture.description,
                  p.caseStudy.architecture.description_sv,
                  locale
                ),
                diagramType: p.caseStudy.architecture.diagramType,
              } : undefined,
              // Localize technical challenges
              technicalChallenges: p.caseStudy.technicalChallenges?.map((challenge: any) => ({
                ...challenge,
                title: getLocalizedValue(challenge.title, challenge.title_sv, locale),
                description: getLocalizedValue(challenge.description, challenge.description_sv, locale),
              })),
              // Localize code snippets
              codeSnippets: p.caseStudy.codeSnippets?.map((snippet: any) => ({
                ...snippet,
                title: getLocalizedValue(snippet.title, snippet.title_sv, locale),
                description: getLocalizedValue(snippet.description, snippet.description_sv, locale),
              })),
            } : undefined,
          };
        });
      }
    } catch (error) {
      console.warn("Sanity fetch failed, falling back to local data.", error);
    }
  }

  // Fallback to localized local data
  return mapLocalProjects(locale);
}

export async function getExperiences(locale: string = "en"): Promise<Experience[]> {
  // Try Sanity first (single source of truth)
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    try {
      const sanityData = await client.fetch(
        `*[_type == "experience"] | order(startDate desc) {
        ...,
        "isProminent": coalesce(isProminent, true)
      }`,
        {},
        { next: { revalidate: 3600 } }
      );

      // If Sanity has data, return it (with localization applied)
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
    } catch (error) {
      console.warn("Sanity fetch failed for experiences, falling back to local data.", error);
    }
  }

  // Fallback to localized local data only if Sanity is unavailable or returns empty
  const primaryLocal = mapExperiences(locale);
  
  // Load localized legacy data (hidden by default)
  const legacyFile = getLegacyData(locale);
  const legacyData = legacyFile.legacyExperience.map((exp: any) => ({
    _id: exp.id,
    company: exp.company,
    title: exp.title,
    startDate: exp.startDate,
    endDate: exp.endDate,
    isCurrent: false,
    isProminent: false, // Ensure hidden behind toggle
    description: exp.description,
    skills: exp.skills
  }));

  return [...primaryLocal, ...legacyData];
}

export async function getEducation(locale: string = "en"): Promise<Education[]> {
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
      // Apply localization to Sanity data
      return data.map((edu: any) => ({
        ...edu,
        degree: getLocalizedValue(edu.degree, edu.degree_sv, locale),
        description: getLocalizedValue(edu.description, edu.description_sv, locale),
      }));
    }
    return mapEducation(locale);
  } catch (error) {
    console.error("Sanity fetch failed for education, using mock data.", error);
    return mapEducation(locale);
  }
}

export async function getProfile(locale: string = "en"): Promise<SkillSet | null> {
  try {
    const data = await client.fetch(
      `*[_type == "skillSet"][0]`,
      {},
      { next: { revalidate: 3600 } }
    );
    if (!data) {
        return mapProfile(locale);
    }
    // Apply localization to Sanity data
    return {
      ...data,
      bio: getLocalizedValue(data.bio, data.bio_sv, locale),
    };
  } catch (error) {
    console.error("Sanity fetch failed for profile, using mock data.", error);
    return mapProfile(locale);
  }
}
