import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getMessages, getTranslations } from "next-intl/server";
import { Providers } from "@/components/providers";
import { FloatingNavbar } from "@/components/ui/floating-navbar";
import { Footer } from "@/components/ui/footer";
import { TerminalModal } from "@/components/features/terminal-modal";
import { TerminalProvider } from "@/lib/terminal-context";
import { BackgroundProvider } from "@/lib/background-context";
import { SceneWrapper } from "@/components/3d/scene-wrapper";
import { BackgroundDimmer } from "@/components/ui/background-dimmer";
import { getSiteUrl } from "@/lib/site-url";
import { JsonLd } from "@/components/seo/jsonld";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const base = getSiteUrl();
  const canonical = new URL(`/${locale}`, base);

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: base,
    alternates: {
      canonical,
      languages: {
        en: new URL(`/en`, base),
        sv: new URL(`/sv`, base),
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "sv" ? "sv_SE" : "en_US",
      url: canonical,
      title: t("title"),
      description: t("description"),
      siteName: "Mikael Sundh",
      images: [
        {
          url: new URL(`/${locale}/opengraph-image`, base),
          width: 1200,
          height: 630,
          alt: "Mikael Sundh — Portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [new URL(`/${locale}/twitter-image`, base)],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

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
        <JsonLd locale={locale} />
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
