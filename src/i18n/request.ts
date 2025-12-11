import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Define your supported locales
const locales = ['en', 'sv'];

export default getRequestConfig(async ({ requestLocale }) => {
  // This corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  // We explicitly cast to any for the includes check to satisfy TypeScript strictness
  if (!locale || !locales.includes(locale as any)) {
    // Fallback to English to prevent crashes if locale is missing
    locale = 'en'; 
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: 'Europe/Stockholm' 
  };
});