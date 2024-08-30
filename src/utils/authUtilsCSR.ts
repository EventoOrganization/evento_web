import { useAuthStore } from "@/store/useAuthStore";
import { decodeToken } from "./auth";

export const getSessionCSR = () => {
  const token = getTokenCSR();
  const user = token ? decodeToken(token) : null;

  return {
    token,
    user,
    isLoggedIn: !!token,
  };
};

export const getTokenCSR = () => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  console.log("token from cookie CSR", !!token);

  return token;
};

export const getTokenFromStore = () => {
  const { user } = useAuthStore.getState();
  console.log("Token from store:");

  return user?.token;
};
