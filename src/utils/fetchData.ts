import { getTokenCSR } from "./authUtilsCSR";
import { getTokenSSR } from "./authUtilsSSR";

export const fetchData = async (
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

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + endpoint,
    fetchOptions,
  );
  console.log(
    `Request sent to ${process.env.NEXT_PUBLIC_API_URL}${endpoint}:`,
    fetchOptions,
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  console.log(`Response from ${endpoint}:`, typeof data);

  return data;
};
