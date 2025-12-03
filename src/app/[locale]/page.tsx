import { Scene } from "@/components/3d/scene";
import { Hero } from "@/components/sections/hero";
import { TerminalToggle } from "@/components/ui/terminal-toggle";

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  return (
    <main className="relative min-h-screen flex-col items-center justify-between">
      <Scene />
      <Hero />
      <TerminalToggle />
    </main>
  );
}
