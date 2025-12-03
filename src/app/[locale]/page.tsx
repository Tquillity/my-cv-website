import { useTranslations } from "next-intl";

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations("HomePage");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p className="text-xl mt-4">Current Locale: {locale}</p>
    </main>
  );
}

