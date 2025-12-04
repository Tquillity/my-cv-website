# Contributing Guide for AI Agents (CONTRIBUTING_AI.md)

**Role:** You are a Senior Next.js Architect and DevOps Engineer.
**Project:** `my-cv-website` (Personal Portfolio with Sanity CMS & AI Chat).
**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Sanity.io.

---

## 🚨 CRITICAL RULES (The "Do Not Break" List)

### 1. Dependency Integrity (STRICT)
*   **Zod:** Must remain pinned to `v3` (specifically `3.23.8`) because Sanity depends on it. **NEVER upgrade to Zod v4.**
*   **AI SDK:** We do **NOT** use the `ai` or `@ai-sdk/openai` libraries anymore due to version conflicts. All AI features must use native `fetch` to call the Groq API directly.
*   **Sanity:** Imports from `@sanity/image-url` must use `require` or careful ESM checks in `src/lib/sanity.ts` to prevent build failures.

### 2. Server vs. Client Boundary
*   **Default:** All components in `src/app` are **Server Components** by default.
*   **"use client":** Only add `"use client"` to leaf components (buttons, interactive forms, framer-motion wrappers) in `src/components/features`.
*   **Data Fetching:** Fetch data in Server Components using `src/lib/data.ts`. Do NOT fetch data in Client Components unless absolutely necessary (e.g., Chat).

### 3. Internationalization (i18n)
*   **Translations:** All user-facing text must use `messages/en.json` and `messages/sv.json`.
*   **Server Components:** Use `import { getTranslations } from 'next-intl/server'`.
*   **Client Components:** Use `import { useTranslations } from 'next-intl'`.
*   **Hook Rule:** Never call `useTranslations` inside an `async` Server Component directly; use `await getTranslations`.

### 4. Environment Safety
*   **Secrets:** `GROQ_API_KEY` and `SANITY_API_TOKEN` are **Server-Side Only**. Never import them into code that runs in the browser.
*   **Public Vars:** Only variables prefixed with `NEXT_PUBLIC_` (like `NEXT_PUBLIC_SANITY_PROJECT_ID`) are safe for the client.

---

## 📂 Directory Structure

```text
/src
  /app
    /[locale]              # Next-Intl Routing Root
      /about               # About Page
      /portfolio           # Portfolio Page
      page.tsx             # Home Page
    /api                   # API Routes (Chat, Resume)
  /components
    /3d                    # Three.js (Client)
    /features              # Interactive UI (Chat, Grid)
    /ui                    # Generic Shadcn-like UI
    /sections              # Page Sections (Hero)
  /lib
    sanity.ts              # CMS Client (Public Read)
    data.ts                # Server-Side Data Fetching
    ai-context.ts          # RAG Context Generation
```

---

## 🛠️ Common Tasks & Patterns

### Adding a New Feature
1.  **State:** If it needs `useState` or `useEffect`, create a new file in `src/components/features` with `"use client"`.
2.  **Integration:** Import that component into a Server Page in `src/app/[locale]/...`.
3.  **Translation:** Add keys to both `en.json` and `sv.json` immediately.

### Fetching Data from Sanity
Always use `src/lib/data.ts`.

```typescript
// Good
export async function getProjects() {
  return client.fetch(GROQ_QUERY);
}
```

### Calling AI (Groq)
Use standard `fetch` in API routes to avoid dependency conflicts.

```typescript
// Good
const response = await fetch("https://api.groq.com/openai/v1/chat/completions", { ... });
```

---

## 🧪 Verification Steps

Before marking a task as complete, the AI Agent must run:
1.  `npm run build` -> **Must succeed without Webpack errors.**
2.  Check for **Hydration Errors** (ensure client components mounting conditional logic uses a `mounted` state check).