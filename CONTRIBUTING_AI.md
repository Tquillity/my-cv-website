# Contributing Guide for AI Agents (CONTRIBUTING_AI.md)

**Role:** You are a Senior Next.js Architect and DevOps Engineer.
**Project:** `my-cv-website` (Personal Portfolio with Sanity CMS & AI Chat).
**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Sanity.io.
**Deployment:** Render.

---

## 🚨 CRITICAL RULES (The "Do Not Break" List)

### 1. Data Visibility Protocol (MANDATORY)
AI Agents are blind to the live Sanity Cloud Database. To prevent data mixups, incorrect mapping, or language crossing:
*   **BEFORE handling any data logic or migration**, run: `npx sanity dataset export production sanity-dump.json`.
*   **READ** the generated `sanity-dump.json` to verify the actual structure and content of titles, descriptions, and tags.
*   **NEVER** assume Sanity content matches local JSON files without checking this dump first. Discrepancies between local files and the database are the primary cause of site-wide logic failures.

### 2. Next.js 16 & React 19 Mandates (STRICT)
*   **Async Request API:** `params`, `searchParams`, and `cookies()` are **PROMISES**.
    *   ❌ **BAD:** `const locale = params.locale;` (Will crash the app)
    *   ✅ **GOOD:** `const { locale } = await params;`
*   **Data Caching:** `fetch` requests are **NOT** cached by default in v16.
    *   You **MUST** add `{ next: { revalidate: 3600 } }` to Sanity fetch calls in `src/lib/data.ts` to protect API limits.
*   **React Compiler:** We use the React Compiler for optimization. Do NOT manually add `useMemo` or `useCallback` unless specifically fixing a proven referential equality bug.

### 3. Data Integrity & "Single Source of Truth" (SOT)
*   **Gatekeeper Logic:** `src/lib/data.ts` is the central fetcher.
*   **Prioritization:** If Sanity returns valid data, **RETURN IT IMMEDIATELY**.
*   **No Duplication:** Do not merge Sanity results with local JSON results (`[...sanity, ...local]`). Local data in `backupdata/` is a **FALLBACK** only.
*   **Backup Folder:** All local master copies of data must be kept in `/backupdata` for reference and recovery.

### 4. Internationalization (i18n)
*   **Site-wide:** All user-facing text must use `messages/en.json` and `messages/sv.json`.
*   **Sanity Content:** Use the `getLocalizedValue(en, sv, locale)` helper in `src/lib/data.ts`.
*   **Project Tags:** Both `name` and `description` (tooltip text) must be localized.
    *   Schema fields: `name_sv` and `description_sv` are mandatory.
*   **Terminal OS (EXCEPTION):** The Terminal feature is **STRICTLY ENGLISH ONLY**.
    *   Lock strings using `src/lib/terminal-strings.ts`, which bypasses the site-wide locale to force the English namespace.

### 5. Terminal OS Stability & Initialization
*   **Boot Sequence:** The initialization effect must be completely isolated from the component's `input` state.
    *   ❌ **CRITICAL BUG:** Including the translation function `t` or the `input` state in the `useEffect` dependency array causes the boot sequence to restart on every keystroke.
*   **Reactive Focus:** Do not use `setTimeout` with short magic numbers (like 50ms) to focus the terminal cursor. Use a `useEffect` that triggers specifically when `isBooting` transitions to `false`.

---

## 📂 Directory Structure

```text
/backupdata            # MASTER local fallbacks (Consolidated clean data)
/src
  /app
    /[locale]          # Next-Intl Routing Root (All params must be awaited!)
    /api/chat          # AI Chat Endpoint (Native fetch to Groq Llama 3.3)
  /components
    /3d                # Three.js Components (R3F + React 19)
    /games             # Terminal Games (Localized strings passed via props)
    /features          # UI Logic (Terminal, AI Chat, Portfolio Grid)
  /lib
    data.ts            # The Data Gatekeeper (SOT Logic)
    terminal-strings.ts# English-only lock for the OS experience
  /sanity
    /schemas           # Content Schemas (Must contain localized _sv fields)
```

---

## 🛠️ Pattern Standards

### Localizing Project Tags
Ensure the mapping logic in `getProjects` handles both the name and the hover description.

```typescript
// src/lib/data.ts mapping pattern
tags: (p.tags || []).map((tag: any) => ({
  ...tag,
  name: getLocalizedValue(tag.name, tag.name_sv, locale),
  description: getLocalizedValue(tag.description, tag.description_sv, locale),
}))
```

### Async Parameter Handling (Next.js 16)
```typescript
// src/app/[locale]/portfolio/page.tsx
export default async function PortfolioPage({ params }) {
  const { locale } = await params; // MANDATORY AWAIT
  const projects = await getProjects(locale);
  // ...
}
```

### Stable Terminal Booting
Keep translation helpers outside the component scope to ensure a stable reference.

```typescript
// src/components/features/terminal-modal.tsx
const t_os = (key: string) => getTerminalString(key); // English identity lock

export const TerminalModal = () => {
  // ...
  useEffect(() => {
    // Only run once on mount/open
  }, [isOpen]); // NEVER include t_os or input here
}
```

---

## 🧪 Verification Checklist

1.  **Database visibility:** Did you run `npx sanity dataset export` and check the dump?
2.  **Logic Separation:** Navigate to `/sv/about`. Do you see duplicate experience roles? If yes, the SOT logic in `src/lib/data.ts` is incorrectly merging arrays.
3.  **Tooltip i18n:** Hover over a project tag on the Swedish site. Is the description Swedish? If no, `description_sv` is not mapped.
4.  **Terminal Lock:** Is the Terminal strictly in English even when the site is set to Swedish?
5.  **Typing Stability:** Open the Terminal and type "Hello" as fast as possible. Does the boot sequence reset or glitch? If yes, the `useEffect` dependencies are incorrect.

---

## 🌐 Production SEO Environment (MANDATORY)

To ensure correct canonical URLs, sitemap entries, `robots.txt` host, OpenGraph/Twitter metadata, and JSON-LD:

- Set `NEXT_PUBLIC_SITE_URL=https://www.mikaelsundh.com` in your Render environment variables.