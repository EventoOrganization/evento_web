// src\utils\authUtilsSSR.ts
import { UserType } from "@/types/UserType";
import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { decodeToken } from "./auth";

export const mapJwtPayloadToUser = (payload: JwtPayload): UserType => {
  // Ensure that payload and payload.data exist and contain the necessary fields
  const data = payload.data || {}; // Fallback to an empty object if data is undefined

  return {
    _id: data.id || "", // Use empty string or some default value if id is missing
    name: data.name || "Anonymous", // Fallback to 'Anonymous' if name is missing
    email: data.email || "", // Use empty string if email is missing
  };
};

export const getSessionSSR = () => {
  const token = getTokenSSR();
  const decodedToken = token ? decodeToken(token) : null;
  console.log("Decoded Token:", decodedToken); // Log the decoded token to inspect the structure

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
