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

