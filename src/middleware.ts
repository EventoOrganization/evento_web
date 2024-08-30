import { NextResponse, type NextRequest } from "next/server";
import { getSessionSSR } from "./utils/authUtilsSSR";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const session = getSessionSSR();

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".js") ||
    pathname.endsWith(".woff2") ||
    ["/manifest.json", "/favicon.ico"].includes(pathname)
  ) {
    return NextResponse.next();
  }
  if (session && session.token) {
    console.log(`Session active for request ${pathname}.`);
  } else {
    console.log(`No session found for request ${pathname}.`);
  }
  // if (!session) {
  //   console.warn(
  //     `No session cookie found for request ${pathname}. Redirecting to the sign-in page.`,
  //   );
  //   return NextResponse.redirect(new URL("/signin", req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // "/:path*",
    // "/profile/:path*"
  ],
};
