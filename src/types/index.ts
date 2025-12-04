export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

export interface Project {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  mainImage: SanityImage | string; // String for mock data URLs
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  publishedAt: string;
}

export interface Experience {
  _id: string;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  skills: string[];
}

export interface Education {
  _id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface SkillSet {
  _id: string;
  bio: string;
  skills: string[];
  languages: { language: string; proficiency: string }[];
}

