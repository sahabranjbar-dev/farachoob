// middleware.ts

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// لیست مسیرهایی که نیاز به احراز هویت دارند
const protectedRoutes = ["/dashboard", "/admin", "/profile", "/panel"];

export async function middleware(request: any) {
  const { nextUrl } = request;
  const isProtected = protectedRoutes.some((path) =>
    nextUrl.pathname.includes(path)
  );

  // اگر مسیر محافظت‌شده بود، توکن رو بررسی کن
  if (isProtected) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // توکن وجود نداره یا منقضی شده => ریدایرکت به لاگین
      const locale = nextUrl.locale || "fa";
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login`, request.url)
      );
    }
  }

  // در نهایت next-intl middleware رو اجرا کن
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
