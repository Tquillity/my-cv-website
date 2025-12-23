"use client";

import dynamic from "next/dynamic";
import { Education, Experience, SkillSet } from "@/types";

// Dynamically import the client component to ensure it only renders on the client
// where NextIntlClientProvider context is guaranteed to be available
const AboutPageContent = dynamic(
  () => import("./about-page-content").then(mod => ({ default: mod.AboutPageContent })),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
);

interface AboutPageWrapperProps {
  education: Education[];
  experience: Experience[];
  profile: SkillSet | null;
}

export function AboutPageWrapper({ education, experience, profile }: AboutPageWrapperProps) {
  return <AboutPageContent education={education} experience={experience} profile={profile} />;
}

