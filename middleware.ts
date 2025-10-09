import { NextRequest, NextResponse } from "next/server";
import { COOKIES } from "@/constants/cookies";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply middleware to login page
  if (pathname === "/login") {
    // Check for both authentication cookies
    const ssid = request.cookies.get(COOKIES.ssid)?.value;

    // If both cookies exist, verify the JWT token
    if (ssid) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Continue with the request for all other cases
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
