import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getMessages } from "next-intl/server";
import { Providers } from "@/components/providers";
import { AIChat } from "@/components/features/ai-chat";
import { TerminalToggle } from "@/components/ui/terminal-toggle";
import { FloatingNavbar } from "@/components/ui/floating-navbar";
import { TerminalModal } from "@/components/features/terminal-modal";
import { TerminalProvider } from "@/lib/terminal-context";
import { BackgroundProvider } from "@/lib/background-context";
import { SceneWrapper } from "@/components/3d/scene-wrapper";
import { BackgroundDimmer } from "@/components/ui/background-dimmer";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio 2025",
  description: "My Portfolio",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <Providers locale={locale} messages={messages}>
          <TerminalProvider>
            <BackgroundProvider>
              <SceneWrapper />
              <BackgroundDimmer />
              <FloatingNavbar locale={locale} />
              {children}
              <AIChat />
              <TerminalModal locale={locale} />
              <TerminalToggle />
            </BackgroundProvider>
          </TerminalProvider>
        </Providers>
      </body>
    </html>
  );
}
