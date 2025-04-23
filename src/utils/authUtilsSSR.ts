// src\utils\authUtilsSSR.ts
import { UserType } from "@/types/UserType";
import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export const mapJwtPayloadToUser = (payload: JwtPayload): UserType => {
  const data = payload;
  return {
    _id: data._id || data.id || "",
    username: data.username || "",
    profileImage: data.profileImage || "",
    email: data.email || "",
  };
};

export const getSessionSSR = () => {
  const raw = cookies().get("sessionData")?.value;
  if (!raw) return { token: null, user: null, isLoggedIn: false };

  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    return {
      token: parsed.token || null,
      user: parsed.user || null,
      isLoggedIn: !!parsed.token,
    };
  } catch (error) {
    console.error("❌ Failed to parse sessionData cookie:", error);
    return { token: null, user: null, isLoggedIn: false };
  }
};

export const getTokenSSR = () => {
  const token = cookies().get("token");
  // console.log("Cookie token:", token?.value);
  if (!token?.value) {
    console.log("Token not found in cookies");
    return null;
  } else {
    return token.value;
  }
};
