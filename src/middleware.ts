import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  // const session = getSessionSSR();

  const token = req.cookies.get("token");
  console.log("Middleware Token detected:", token?.value);
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    ["/manifest.json", "/favicon.ico"].includes(pathname)
  ) {
    return NextResponse.next();
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
    // "/profile/:path*"
  ],
};
