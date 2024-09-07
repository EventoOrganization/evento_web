// src\utils\authUtilsSSR.ts
import { UserType } from "@/types/UserType";
import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { decodeToken } from "./auth";

export const mapJwtPayloadToUser = (payload: JwtPayload): UserType => {
  const data = payload;
  return {
    _id: data._id || data.id || "",
    name: data.name || "Anonymous",
    email: data.email || "",
  };
};

export const getSessionSSR = () => {
  const token = getTokenSSR();
  const decodedToken = token ? decodeToken(token) : null;
  const user = decodedToken ? mapJwtPayloadToUser(decodedToken) : null;
  console.log("User from token:", user);

  return {
    token,
    user,
    isLoggedIn: !!token,
  };
};

export const getTokenSSR = () => {
  const token = cookies().get("token");
  console.log("Cookie token:", token?.value);
  if (!token?.value) {
    console.log("Token not found in cookies");
    return null;
  } else {
    return token.value;
  }
};
