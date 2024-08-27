import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  console.log("Received request for:", pathname);
  const cookies = req.cookies;
  // console.log("Middleware Cookies detected:", cookies);

  const sessionCookie = req.cookies.get("connect.sid");
  // console.log(" Middleware Session Cookie detected:", sessionCookie);

  const token = req.cookies.get("token");
  console.log("Middleware Token detected:", token?.value);
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    ["/manifest.json", "/favicon.ico"].includes(pathname)
  ) {
    return NextResponse.next();
  }

  if (!sessionCookie) {
    console.warn(
      `No session cookie found for request ${pathname}. Redirecting to the sign-in page.`,
    );
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // console.log(
  //   `Session cookie found: ${sessionCookie.value}. Proceeding with the request to ${pathname}`,
  // );
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*"],
};
