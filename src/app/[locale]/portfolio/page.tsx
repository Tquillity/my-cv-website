import { getProjects } from "@/lib/data";
import { PortfolioGrid } from "@/components/features/portfolio-grid";
import { getTranslations } from "next-intl/server";

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
