import { getExperiences } from "@/lib/data";
import { TimelineItem } from "@/components/features/timeline-item";
import { getTranslations } from "next-intl/server";

export default async function AboutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const experiences = await getExperiences();
  const t = await getTranslations("AboutPage");

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-24 max-w-4xl">
      <section className="mb-20">
        <h1 className="text-4xl font-bold mb-12">{t('title')}</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          {t('intro')}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-8">{t('experience_section')}</h2>
        <div className="space-y-0">
          {experiences.map((experience, index) => (
            <TimelineItem
              key={experience._id}
              experience={experience}
              index={index}
            />
          ))}
        </div>
      </section>
      </div>
    </main>
  );
}