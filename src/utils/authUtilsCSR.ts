import { useAuthStore } from "@/store/useAuthStore";
import { decodeToken } from "./auth";

export const getSessionCSR = () => {
  const token = getTokenCSR();
  const user = token ? decodeToken(token) : null;
  console.log("IsLoggedIn CSR", !!token);
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
  if (!token) {
    console.log("token from cookie CSR", !!token);
    return null;
  } else {
    console.log("token from cookie CSR", !!token);
    return token;
  }
};

export const getTokenFromStore = () => {
  const { user } = useAuthStore.getState();
  console.log("Token from store:");
  if (user?.token) {
    console.log("Token from store:", !!user?.token);
    return user?.token;
  } else {
    console.log("Token from store:", !!user?.token);
    return null;
  }
};
