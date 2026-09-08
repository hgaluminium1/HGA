import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "@/auth.config";
import { safeAdminCallbackUrl } from "@/lib/auth/safe-callback-url";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { pathname } = req.nextUrl;

  // Authenticated users on login → desk
  if (pathname.startsWith("/admin/login") && req.auth) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }

  // Auth gate for admin (except login)
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !req.auth
  ) {
    const url = new URL("/admin/login", req.nextUrl.origin);
    url.searchParams.set(
      "callbackUrl",
      safeAdminCallbackUrl(pathname),
    );
    return NextResponse.redirect(url);
  }

  // Protect CMS write APIs without session
  const cmsApi =
    pathname.startsWith("/api/v1/pages") ||
    pathname.startsWith("/api/v1/preview") ||
    pathname.startsWith("/api/v1/products") ||
    pathname.startsWith("/api/v1/categories") ||
    pathname.startsWith("/api/v1/dictionaries") ||
    pathname.startsWith("/api/v1/media") ||
    pathname.startsWith("/api/v1/corporate") ||
    pathname.startsWith("/api/v1/import") ||
    pathname.startsWith("/api/v1/export") ||
    (pathname.startsWith("/api/v1/redirects") &&
      !pathname.startsWith("/api/v1/redirects/active"));
  if (cmsApi && !req.auth) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Sign in required" },
      },
      { status: 401 },
    );
  }

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  try {
    const res = await fetch(
      new URL("/api/v1/redirects/active", req.nextUrl.origin),
      { next: { revalidate: 60 } },
    );
    if (res.ok) {
      const json = (await res.json()) as {
        data?: Array<{
          fromPath: string;
          toPath: string;
          statusCode: 301 | 302;
        }>;
      };
      const match = json.data?.find((r) => r.fromPath === pathname);
      if (match) {
        return NextResponse.redirect(
          new URL(match.toPath, req.nextUrl.origin),
          match.statusCode,
        );
      }
    }
  } catch {
    // Soft-fail redirects if API unavailable
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
