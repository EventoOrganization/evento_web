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
        // console.log(res);
        //const res: any | null = await response.json();
        if (res) {
          console.log(
            "Authorize - Token received from backend:",
            res.body.token,
          );
          // get error localStorate is not defined
          //localStorage.setItem("authToken", res.body.token);
          return res.body;
        } else {
          throw new Error("Invalid credentials");
        }
      },
      credentials: undefined,
    }),
  ],
});
