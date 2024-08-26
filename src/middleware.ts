import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  console.log("Cookies reçus:", req.cookies);
  // const token = req.cookies.get("token");
  // console.log("Token:", token);

  // Ignore requests to public files, API routes, and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    [
      "/manifest.json",
      "/favicon.ico",
      // Add more public files if needed
    ].includes(pathname)
  ) {
    return NextResponse.next();
  }

  // Redirect to login if the token is missing
  // if (!token) {
  //   return NextResponse.redirect(new URL("/signin", req.url));
  // }

  // Proceed with the request if the token is present
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*"], // Routes that need authentication
};
