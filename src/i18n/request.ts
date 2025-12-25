import { getRequestConfig } from "next-intl/server";

const locales = ["en", "sv"] as const;
type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  const resolvedLocale: Locale = locale === "sv" ? "sv" : "en";

  return {
    locale: resolvedLocale,
    messages: (await import(`../../messages/${resolvedLocale}.json`)).default,
    timeZone: "Europe/Stockholm",
  };
});