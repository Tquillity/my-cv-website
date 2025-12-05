// import { Scene } from "@/components/3d/scene";
import { Hero } from "@/components/sections/hero";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main className="relative z-0 min-h-screen flex-col items-center justify-between">
      {/* <Scene /> */}
      <Hero locale={locale} />
    </main>
  );
}
