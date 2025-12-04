import { getProjects } from "@/lib/data";
import { PortfolioGrid } from "@/components/features/portfolio-grid";
import { useTranslations } from "next-intl";

export default async function PortfolioPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const projects = await getProjects();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold mb-12 text-center">Portfolio</h1>
      <PortfolioGrid projects={projects} />
      </div>
    </main>
  );
}

