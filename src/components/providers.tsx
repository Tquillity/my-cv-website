"use client";

import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import { ThemeProvider } from "next-themes";
import { FaviconManager } from "@/components/ui/favicon-manager";

interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Stockholm">
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem 
        themes={['light', 'dark', 'middle']}
      >
        <FaviconManager />
        {children}
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
