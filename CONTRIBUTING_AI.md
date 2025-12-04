# Contributing Guide for AI Agents (CONTRIBUTING_AI.md)

**Role:** You are a Senior Next.js Architect and DevOps Engineer.
**Project:** `my-cv-website` (Personal Portfolio with Sanity CMS & AI Chat).
**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Sanity.io (Next-Sanity), Groq API.

---

## 🚨 CRITICAL RULES (The "Do Not Break" List)

### 1. Dependency Integrity (STRICT)
*   **Zod:** Must remain pinned to `v3` (specifically `3.23.8`) because Sanity depends on it. **NEVER upgrade to Zod v4.**
*   **AI SDK:** We do **NOT** use the `ai` or `@ai-sdk/openai` libraries due to version conflicts. All AI features must use native `fetch` to call the Groq API directly.
*   **Sanity Clients:** 
    *   Use `src/lib/sanity.ts` for **frontend data fetching**.
    *   Use `src/sanity/lib/client.ts` for **Studio configuration** only.
    *   Do **not** mix these configurations.

### 2. Server vs. Client Boundary
*   **Default:** All components in `src/app` are **Server Components** by default.
*   **"use client":** Only add `"use client"` to leaf components (buttons, interactive forms, framer-motion wrappers, Three.js scenes) in `src/components/features` or `src/components/3d`.
*   **Data Fetching:** Fetch data in Server Components using `src/lib/data.ts`. Do NOT fetch data in Client Components unless absolutely necessary (e.g., Chat, Search).

### 3. Internationalization (i18n)
*   **Translations:** All user-facing text must use `messages/en.json` and `messages/sv.json`.
*   **Async Server Components:** Use `const t = await getTranslations('Namespace')`.
*   **Client Components:** Use `const t = useTranslations('Namespace')`.
*   **Timezone:** The app is hardcoded to `Europe/Stockholm` in `src/i18n/request.ts`. Do not remove this.

### 4. Environment Safety
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
      page.tsx             # Home Page
    /api
      /chat                # AI Chat Endpoint (Llama 3.3)
      /migrate             # One-off migration scripts (Write Client)
      /seed-profile        # Seeding scripts
    /studio                # Sanity Studio Route
  /components
    /3d                    # Three.js (Client - StarField, Scene)
    /features              # Interactive UI (Chat, Grid, Timeline)
    /ui                    # Generic Shadcn-like UI (Motion wrappers)
    /sections              # Page Sections (Hero)
  /lib
    sanity.ts              # Frontend CMS Client (Public Read)
    data.ts                # Server-Side Data Fetching (w/ Mock Fallback)
    ai-context.ts          # RAG Context Generation
  /sanity                  # Sanity Studio Configuration (Auto-generated)
    /schemas               # Content Schemas (project, experience, etc.)
    /lib                   # Studio-specific clients
```

---

## 🛠️ Common Tasks & Patterns

### Adding a New Feature
1.  **State:** If it needs `useState` or `useEffect`, create a new file in `src/components/features` with `"use client"`.
2.  **Integration:** Import that component into a Server Page in `src/app/[locale]/...`.
3.  **Translation:** Add keys to both `en.json` and `sv.json`.

### Fetching Data from Sanity
Always use `src/lib/data.ts`. This file handles the switch between **Live Sanity Data** and **Local Mock Data** automatically.

```typescript
// Good
export async function getProjects() {
  // Logic inside data.ts handles the fallback
  return client.fetch(GROQ_QUERY);
}
```

### Calling AI (Groq)
Use standard `fetch` in API routes. The current model is **Llama 3.3 (70b)**.

```typescript
// src/app/api/chat/route.ts
const payload = {
  model: "llama-3.3-70b-versatile",
  messages: [...],
  // ...
};
```

### Modifying Content Schema
1.  Edit files in `src/sanity/schemas/`.
2.  Import and add them to `src/sanity/schemaTypes/index.ts`.
3.  Run the dev server and visit `/studio` to verify.

---

## 🧪 Verification Steps

Before marking a task as complete, the AI Agent must run:
1.  `npm run build` -> **Must succeed without Webpack errors.**
2.  **Hydration Check:** Ensure `suppressHydrationWarning` is present on the `<html>` tag in `layout.tsx`, but still check console for React hydration mismatches, especially in the 3D scene or localized text.