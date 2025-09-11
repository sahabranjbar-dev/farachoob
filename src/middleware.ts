// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

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
      return NextResponse.redirect(new URL(`/auth/login`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
