import { getProjects } from "@/lib/data";
import { PortfolioGrid } from "@/components/features/portfolio-grid";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PortfolioPage" });
  const meta = await getTranslations({ locale, namespace: "Metadata" });
  const base = getSiteUrl();
  const canonical = new URL(`/${locale}/portfolio`, base);

  return {
    title: `${t("title")} | ${meta("title")}`,
    description: meta("description"),
    alternates: {
      canonical,
      languages: {
        en: new URL(`/en/portfolio`, base),
        sv: new URL(`/sv/portfolio`, base),
      },
    },
    openGraph: {
      url: canonical,
    },
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const projects = await getProjects(locale);
  const t = await getTranslations("PortfolioPage");

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold mb-12 text-center">{t('title')}</h1>
      <PortfolioGrid projects={projects} />
      </div>
    </main>
  );
}
