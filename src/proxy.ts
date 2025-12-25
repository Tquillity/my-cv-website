import createMiddleware from 'next-intl/middleware';
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'sv'],
  // Used when no locale matches
  defaultLocale: 'en'
});

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect the Sanity Studio route in production.
  if (pathname.startsWith("/studio")) {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.next();
    }

    const expected = process.env.STUDIO_BASIC_AUTH;
    if (!expected) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const auth = req.headers.get("authorization") || "";
    if (auth === `Basic ${expected}`) {
      return NextResponse.next();
    }

    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Studio", charset="UTF-8"' },
    });
  }

  return intlMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|\\.well-known|.*\\..*).*)', '/studio/:path*']
};