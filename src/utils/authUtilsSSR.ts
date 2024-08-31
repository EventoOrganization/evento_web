// src\utils\authUtilsSSR.ts
import { UserType } from "@/types/UserType";
import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { decodeToken } from "./auth";

export const mapJwtPayloadToUser = (payload: JwtPayload): UserType => {
  return {
    _id: payload.data.id,
    name: payload.data.name,
    email: payload.data.email,
  };
};

export const getSessionSSR = () => {
  const token = getTokenSSR();
  const decodedToken = token ? decodeToken(token) : null;
  const user = decodedToken ? mapJwtPayloadToUser(decodedToken) : null;
  console.log("IsLoggedIn SSR", !!token);
  return {
    token,
    user,
    isLoggedIn: !!token,
  };
};

export const getTokenSSR = () => {
  const token = cookies().get("token");
  if (!token?.value) {
    console.log("token from cookie SSR", !!token?.value);
    return null;
  } else {
    console.log("token from cookie SSR", !!token?.value);
    return token?.value;
  }
};
