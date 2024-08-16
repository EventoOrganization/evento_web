// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// //import Apple from "next-auth/providers/apple";
// import { API } from "@/constants";
// import apiService from "@/lib/apiService";
export const GET = () => new Response("Not implemented", { status: 501 });
export const POST = () => new Response("Not implemented", { status: 501 });

// interface User {
//   id: string;
//   email: string;
//   password: string;
// }

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID || "",
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: {
//           label: "Email",
//           type: "text",
//           placeholder: "john.doe@example.com",
//         },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         // Implement your authentication logic here
//         // You can make API calls to verify the credentials and return the user object
//         // For example:
//         const response = await apiService.post(API.signUp, { credentials });

//         const user: User | null = await response.json();

//         if (user) {
//           return user;
//         } else {
//           throw new Error("Invalid credentials");
//         }
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/auth/signin",
//     error: "/auth/error",
//   },
//   session: { strategy: "jwt" },
//   callbacks: {
//     async signIn(userDetail) {
//       if (Object.keys(userDetail).length === 0) {
//         return false;
//       }
//       return true;
//     },
//     async redirect({ baseUrl }) {
//       return `${baseUrl}/protected`;
//     },
//     async session({ session, token }) {
//       if (session.user?.name) session.user.name = token.name;
//       return session;
//     },
//   },
// });

// export { handler as GET, handler as POST };
