import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};

// // middleware.ts
// import createMiddleware from "next-intl/middleware";
// import { routing } from "./i18n/routing";

// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { getServerSession } from "next-auth/next";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { prisma } from "@/lib/prisma";

// // middleware برای مدیریت زبان
// const intlMiddleware = createMiddleware(routing);

// export default async function middleware(request: NextRequest) {
//   // اول اجرا کردن middleware زبان
//   const intlResult = intlMiddleware(request);
//   if (intlResult) return intlResult;

//   // فقط برای مسیرهای داشبورد چک کنیم
//   if (request.nextUrl.pathname.startsWith("/dashboard")) {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//       return NextResponse.redirect(new URL("/auth/login", request.url));
//     }

//     const userPermissions = session.user.permissions;

//     const pathname = request.nextUrl.pathname;

//     const menu = await prisma.menu.findFirst({
//       where: { href: pathname, status: true },
//       include: { permission: true },
//     });

//     if (
//       menu &&
//       menu.permission &&
//       !userPermissions.includes(menu.permission.name)
//     ) {
//       return NextResponse.redirect(
//         new URL("/dashboard/unauthorized", request.url)
//       );
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
// };
