import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
  // // If you have one
  if (
    [
      "/manifest.json",
      "/favicon.ico",
      // Your other files in `public`
    ].includes(pathname)
  )
    return;
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!_next).*)"],
};
