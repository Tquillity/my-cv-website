# Contributing Guide for AI Agents (CONTRIBUTING_AI.md)

**Role:** You are a Senior Next.js Architect and DevOps Engineer.
**Project:** `my-cv-website` (Personal Portfolio with Sanity CMS & AI Chat).
**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Sanity.io.
**Deployment:** Render.

---

## 🚨 CRITICAL RULES (The "Do Not Break" List)

### 1. Next.js 16 & React 19 Mandates (STRICT)
*   **Async Request API:** `params`, `searchParams`, and `cookies()` are **PROMISES**.
    *   ❌ **BAD:** `const slug = params.slug;` (Will crash the app)
    *   ✅ **GOOD:** `const { slug } = await params;`
*   **Data Caching:** `fetch` requests are **NOT** cached by default.
    *   You **MUST** add `{ next: { revalidate: 3600 } }` to Sanity fetch calls in `src/lib/data.ts` to prevent API rate limiting.
*   **React Compiler:** We use the React Compiler. Do NOT manually add `useMemo` or `useCallback` unless specifically fixing a referential equality bug.

### 2. Dependency Integrity
*   **Zod:** Must remain pinned to `v3` (specifically `3.23.8`) for Sanity compatibility. **NEVER upgrade to Zod v4.**
*   **AI SDK:** We do **NOT** use the `ai` or `@ai-sdk/openai` libraries due to version conflicts. All AI features must use native `fetch` to call the Groq API directly.
*   **Three.js:** Ensure `@react-three/fiber` and `@react-three/drei` versions are compatible with React 19.

### 3. Server vs. Client Boundary
*   **Default:** All components in `src/app` are **Server Components**.
*   **"use client":** Only add `"use client"` to leaf components (buttons, interactive forms, framer-motion wrappers, Three.js scenes) in `src/components`.
*   **Data Fetching:** Fetch data in Server Components using `src/lib/data.ts`. Do NOT fetch data in Client Components unless absolutely necessary (e.g., Chat).

### 4. Internationalization (i18n)
*   **Translations:** All user-facing text must use `messages/en.json` and `messages/sv.json`.
*   **Async Server Components:** Use `const t = await getTranslations('Namespace')`.
*   **Client Components:** Use `const t = useTranslations('Namespace')`.
*   **Timezone:** The app is hardcoded to `Europe/Stockholm` in `src/i18n/request.ts`. Do not remove this.

### 5. Environment Safety
*   **Secrets:** `GROQ_API_KEY` and `SANITY_API_TOKEN` are **Server-Side Only**.
*   **Public Vars:** Only variables prefixed with `NEXT_PUBLIC_` are safe for the client.
*   **Missing Env Vars:** The application handles missing Sanity keys by falling back to "MOCK" data in `src/lib/data.ts`. Preserve this fallback logic.

---

## 📂 Directory Structure

```text
/src
  /app
    /[locale]              # Next-Intl Routing Root
      /about               # About Page
      /portfolio           # Portfolio Page
      page.tsx             # Home Page (Async Params!)
    /api
      /chat                # AI Chat Endpoint (Llama 3.3)
      /migrate             # One-off migration scripts
    /studio                # Sanity Studio Route
  /components
    /3d                    # Three.js (Client - StarField, Scene)
    /features              # Interactive UI (Chat, Grid, Timeline)
    /ui                    # Generic Shadcn-like UI
    /sections              # Page Sections (Hero)
  /lib
    sanity.ts              # Frontend CMS Client (Public Read)
    data.ts                # Server-Side Data Fetching (w/ Mock Fallback)
    ai-context.ts          # RAG Context Generation
  /sanity                  # Sanity Studio Configuration
    /schemas               # Content Schemas
```

---

## 🛠️ Common Tasks & Patterns

### Adding a New Feature
1.  **State:** If it needs `useState`, create a new file in `src/components/features` with `"use client"`.
2.  **Integration:** Import that component into a Server Page in `src/app/[locale]/...`.
3.  **Translation:** Add keys to both `en.json` and `sv.json`.

### Fetching Data from Sanity
Always use `src/lib/data.ts`. This file handles the switch between **Live Sanity Data** and **Local Mock Data**.

```typescript
// Good (Next.js 16 Pattern)
export async function getProjects() {
  // Explicit revalidation is required in v16
  return client.fetch(GROQ_QUERY, {}, { next: { revalidate: 3600 } });
}
```

### Calling AI (Groq)
Use standard `fetch` in API routes. The current model is **Llama 3.3 (70b)**.

```typescript
// src/app/api/chat/route.ts
const payload = {
  model: "llama-3.3-70b-versatile",
  messages: [...],
};
```

---

## 🧪 Verification Steps

Before marking a task as complete, the AI Agent must run:
1.  `npm run build` -> **Must succeed without Webpack errors.**
2.  **Async Param Check:** Verify no `params.slug` usage exists without `await`.
3.  **Hydration Check:** Ensure `suppressHydrationWarning` is present on the `<html>` tag, but check console for React hydration mismatches (common in React 19 upgrades).