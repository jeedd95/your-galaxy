import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const regex = /^(?:[1-9]\d{0,2}|999)$/;
  const section = request.nextUrl.pathname.split("/")[1];

  if (!regex.test(section)) {
    return NextResponse.redirect(new URL("/1", request.url));
  }
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
    "/((?!api|_next/static|_next/image|favicon.ico|star.png).*)",
  ],
};
