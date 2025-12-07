import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getMessages } from "next-intl/server";
import { Providers } from "@/components/providers";
import { FloatingNavbar } from "@/components/ui/floating-navbar";
import { Footer } from "@/components/ui/footer";
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
  // Favicon is managed dynamically by FaviconManager component based on theme
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
              <TerminalModal locale={locale} />
              <Footer />
            </BackgroundProvider>
          </TerminalProvider>
        </Providers>
      </body>
    </html>
  );
}
