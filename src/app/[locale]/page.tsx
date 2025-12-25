import { Hero } from "@/components/sections/hero";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const base = getSiteUrl();
  const canonical = new URL(`/${locale}`, base);

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical,
      languages: {
        en: new URL(`/en`, base),
        sv: new URL(`/sv`, base),
      },
    },
    openGraph: {
      url: canonical,
    },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main className="relative z-0 min-h-screen flex-col items-center justify-between">
      <Hero locale={locale} />
    </main>
  );
}
