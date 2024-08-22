import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "../auth.config";
import { API } from "./constants";
import apiService from "./lib/apiService";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const res: any | null = await apiService.post(API.login, credentials);
        //const res: any | null = await response.json();
        if (res) {
          return res;
        } else {
          throw new Error("Invalid credentials");
        }
      },
      credentials: undefined,
    }),
  ],
});
