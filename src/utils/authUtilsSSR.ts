import { cookies } from "next/headers";
import { decodeToken } from "./auth";

export const getSessionSSR = () => {
  const token = getTokenSSR();
  const user = token ? decodeToken(token) : null;

  return {
    token,
    user,
    isLoggedIn: !!token,
  };
};

export const getTokenSSR = () => {
  const token = cookies().get("token");
  return token?.value;
};
