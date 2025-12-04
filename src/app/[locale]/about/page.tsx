import { getExperiences, getEducation, getProfile } from "@/lib/data";
import { AboutPageContent } from "@/components/features/about-page-content";

export default async function AboutPage() {
  const education = await getEducation();
  const experience = await getExperiences();
  const profile = await getProfile();

  return <AboutPageContent education={education} experience={experience} profile={profile} />;
}
