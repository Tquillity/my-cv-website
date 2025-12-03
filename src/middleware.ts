import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'sv'],
  defaultLocale: 'en'
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};

