import { getExperiences, getEducation, getProfile } from "@/lib/data";
import { AboutPageWrapper } from "@/components/features/about-page-wrapper";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });
  const meta = await getTranslations({ locale, namespace: "Metadata" });
  const base = getSiteUrl();
  const canonical = new URL(`/${locale}/about`, base);

  return {
    title: `${t("title")} | ${meta("title")}`,
    description: t("subtitle"),
    alternates: {
      canonical,
      languages: {
        en: new URL(`/en/about`, base),
        sv: new URL(`/sv/about`, base),
      },
    },
    openGraph: {
      url: canonical,
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const education = await getEducation(locale);
  const experience = await getExperiences(locale);
  const profile = await getProfile(locale);

  return <AboutPageWrapper education={education} experience={experience} profile={profile} />;
}
