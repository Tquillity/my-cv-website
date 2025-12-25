# Security

This repository is a public portfolio application. The security posture is designed for a public-facing site while keeping operational complexity appropriate for a portfolio.

## HTTP Security Headers

Configured in `next.config.mjs` via `headers()`:

- `Content-Security-Policy` (CSP)
- `Strict-Transport-Security` (production only)
- `Referrer-Policy`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy`
- `Cross-Origin-Resource-Policy`

### CSP notes

The CSP currently allows `script-src 'unsafe-inline'` to remain compatible with Next.js inline scripts without nonce plumbing. `unsafe-eval` is not allowed.

## AI Chat API hardening

Endpoint: `src/app/api/chat/route.ts`

Controls:

- Request body validation via Zod (shape, length limits)
- Best-effort payload size rejection via `content-length`
- Best-effort Origin/Host validation to reduce cross-site abuse
- In-memory token bucket rate limiting (per IP)
- Upstream timeout via `AbortController`
- Sanitized error responses to avoid leaking upstream details

## Studio protection

Studio route protection is enforced in middleware (`src/proxy.ts`) in production using HTTP Basic Auth via `STUDIO_BASIC_AUTH`.

## Reporting

If you discover a security issue, please open a private report or contact the repository owner directly.


