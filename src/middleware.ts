import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected Admin Routes
const ADMIN_PROTECTED_ROUTES = [
  "/daudpakeketapel",
  "/bahteranabinuh",
  "/limarotiduaikan",
  "/rumahtanggaallah",
  "/admin",
];

const LOGIN_ROUTE = "/pausmakanyunus";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const adminToken =
    request.cookies.get("admin_token")?.value ||
    request.cookies.get("pmk_admin_token")?.value;

  const isProtectedRoute = ADMIN_PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isLoginRoute = pathname === LOGIN_ROUTE || pathname.startsWith(`${LOGIN_ROUTE}/`);

  // 1. If accessing protected admin route without auth token, redirect to login
  if (isProtectedRoute && !adminToken) {
    const loginUrl = new URL(LOGIN_ROUTE, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If already logged in and visiting login page, redirect to admin dashboard
  if (isLoginRoute && adminToken) {
    const dashboardUrl = new URL("/daudpakeketapel", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (/api/*)
     * - static files (_next/static, _next/image, favicon.ico, images, logo.png)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|logo.png|.*\\..*).*)",
  ],
};
