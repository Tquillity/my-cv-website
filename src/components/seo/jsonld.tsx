import "server-only";
import { getSiteUrl } from "@/lib/site-url";

export function JsonLd({ locale }: { locale: string }) {
  const base = getSiteUrl();
  const url = new URL(`/${locale}`, base).toString();

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mikael Sundh",
    url,
    sameAs: [
      "https://github.com/Tquillity",
      "https://www.linkedin.com/in/mikael-sundh/",
    ],
    jobTitle: "Fullstack Engineer",
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mikael Sundh Portfolio",
    url,
    inLanguage: locale,
  };

  const graph = { "@context": "https://schema.org", "@graph": [person, website] };

  return (
    <script type="application/ld+json">
      {JSON.stringify(graph)}
    </script>
  );
}


