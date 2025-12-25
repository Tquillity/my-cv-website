# my-cv-website

Personal portfolio for **Mikael Sundh** built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind**, and **Sanity**.

## Environment (Production)

### Canonical URLs / SEO (REQUIRED)

Set this in your hosting provider (Render) as an environment variable:

- `NEXT_PUBLIC_SITE_URL=https://www.mikaelsundh.com`

This is used for:
- `canonical` + `hreflang` alternates
- `robots.txt` sitemap/host
- `sitemap.xml` absolute URLs
- OpenGraph/Twitter metadata
- JSON-LD structured data

## Development

Install dependencies:

```bash
npm install
```

Build:

```bash
npm run build
```

Tests (Playwright):

```bash
# Run your dev server yourself, then:
PLAYWRIGHT_BASE_URL=http://localhost:3000 npm test
```


