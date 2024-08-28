import jwtDecode, { JwtPayload } from "jwt-decode";
import { cookies } from "next/headers";

export const getSessionSSR = () => {
  const token = getTokenSSR();
  const user = token ? decodeToken(token) : null;

  return {
    token,
    user,
    isLoggedIn: !!token,
  };
};

export const getSessionCSR = () => {
  const token = getTokenCSR();
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

export const getTokenCSR = () => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  return token;
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const decoded = (jwtDecode as unknown as (token: string) => JwtPayload)(
      token,
    );
    return decoded;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const fetchDataFromApi = async (
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  options: RequestInit = {},
) => {
  let token;
  if (typeof window === "undefined") {
    // We're in SSR
    token = getTokenSSR();
  } else {
    // We're in CSR
    token = getTokenCSR();
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const fetchOptions: RequestInit = {
    ...options,
    method,
    headers,
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(endpoint, fetchOptions);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
