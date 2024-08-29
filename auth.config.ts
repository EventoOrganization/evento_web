// import type { NextAuthConfig } from "next-auth";

// export const authConfig = {
//   secret: process.env.AUTH_SECRET,
//   pages: {
//     signIn: "/signin",
//     newUser: "/signup",
//   },
//   callbacks: {
//     async authorized({ auth, request: { nextUrl } }) {
//       const isLoggedIn = !!auth?.user;
//       const isOnLoginPage = nextUrl.pathname.startsWith("/signin");
//       const isOnSignupPage = nextUrl.pathname.startsWith("/signup");

//       if (isLoggedIn) {
//         if (isOnLoginPage || isOnSignupPage) {
//           return Response.redirect(new URL("/", nextUrl));
//         }
//       }

//       return true;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token = { ...token, id: user.id };
//       }

//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         const { id } = token as { id: string };
//         const { user } = session;

//         session = { ...session, user: { ...user, id } };
//       }

//       return session;
//     },
//   },
//   providers: [],
//   session: { strategy: "jwt" },
// } satisfies NextAuthConfig;
