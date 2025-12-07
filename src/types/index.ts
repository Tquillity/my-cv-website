export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

export interface CodeSnippet {
  title: string;
  language: string;
  code: string;
  description: string;
}

export interface CaseStudy {
  problem: string;
  solution: string;
  architecture?: {
    diagramType: "omnicomment-flow";
    description: string;
  };
  technicalChallenges: {
    title: string;
    description: string;
  }[];
  codeSnippets: CodeSnippet[];
}

export interface Project {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  mainImage: SanityImage | string; // String for mock data URLs
  additionalImages?: (SanityImage | string)[]; // Array of additional images for carousel
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  publishedAt: string;
  // NEW FIELD
  caseStudy?: CaseStudy;
  // NEW FIELD
  downloads?: {
    linux?: string;
    windows?: string;
    mac?: string;
  };
}

export interface Experience {
  _id: string;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  isProminent?: boolean;
  description: string;
  skills: string[];
}

export interface Education {
  _id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate?: string;
  isProminent?: boolean;
  description: string;
}

export interface SkillSet {
  _id: string;
  bio: string;
  skills: string[];
  languages: { language: string; proficiency: string }[];
}
