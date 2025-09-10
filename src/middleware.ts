// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const protectedRoutes = ["/dashboard", "/admin", "/profile", "/panel"];

export async function middleware(request: any) {
  // ابتدا بررسی احراز هویت
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  const isProtected = protectedRoutes.some((path) => pathname.includes(path));

  if (isProtected) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // استخراج locale از مسیر
      const locale = pathname.split("/")[1] || "fa";
      const validLocale = routing.locales.includes(locale) ? locale : "fa";

      return NextResponse.redirect(
        new URL(`/${validLocale}/auth/login`, request.url)
      );
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
