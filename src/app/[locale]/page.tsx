// import { Scene } from "@/components/3d/scene";
import { Hero } from "@/components/sections/hero";

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  return (
    <main className="relative z-0 min-h-screen flex-col items-center justify-between">
      {/* <Scene /> */}
      <Hero locale={locale} />
    </main>
  );
}