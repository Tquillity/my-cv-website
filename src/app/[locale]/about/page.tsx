import { getExperiences, getEducation, getProfile } from "@/lib/data";
import { AboutPageContent } from "@/components/features/about-page-content";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const education = await getEducation(locale);
  const experience = await getExperiences(locale);
  const profile = await getProfile(locale);

  return <AboutPageContent education={education} experience={experience} profile={profile} />;
}
