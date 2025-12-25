import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true, // Enable React 19 Compiler (moved from experimental)
  compiler: {
    styledComponents: true,
  },
  async headers() {
    // Baseline security headers for a public-facing portfolio.
    // Note: CSP uses 'unsafe-inline' to remain compatible with Next.js inline scripts without nonce plumbing.
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      // Allow Next inline scripts; do NOT allow unsafe-eval.
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://cdn.sanity.io https://rawcdn.githack.com",
      "font-src 'self' data:",
      // Needed for AI chat + Sanity Studio/clients
      "connect-src 'self' https://api.groq.com https://cdn.sanity.io https://*.api.sanity.io wss://*.api.sanity.io https://rawcdn.githack.com",
      "frame-src 'self'",
      "upgrade-insecure-requests",
    ].join('; ');

    const securityHeaders = [
      { key: 'Content-Security-Policy', value: csp },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-DNS-Prefetch-Control', value: 'off' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
      // HSTS only makes sense in production where HTTPS is guaranteed.
      ...(process.env.NODE_ENV === 'production'
        ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' }]
        : []),
    ];

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Allow quality={100} in the Lightbox for high-fidelity images
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Optimize dev server behavior
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default withNextIntl(nextConfig);