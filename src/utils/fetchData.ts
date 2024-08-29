"use server";
import { getTokenCSR, getTokenFromStore } from "./authUtilsCSR";
import { getTokenSSR } from "./authUtilsSSR";

export const fetchData = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  options: RequestInit = {},
): Promise<T | null> => {
  let token;
  if (typeof window === "undefined") {
    // We're in SSR
    token = getTokenSSR();
  } else {
    // We're in CSR
    token = getTokenCSR() || getTokenFromStore();
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
  console.log(
    `Request sent to ${process.env.NEXT_PUBLIC_API_URL}${endpoint}:`,
    // fetchOptions,
  );
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + endpoint,
      fetchOptions,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { success: boolean; body?: T; data?: T; [key: string]: any } =
      await response.json();
    console.log(`Response from ${endpoint} is ${response.status}:`);
    // console.log(`Full response from ${endpoint}:`, data);
    if ("body" in data && data.body) {
      return data.body;
    } else if ("data" in data && data.data) {
      return data.data;
    } else {
      throw new Error(`Unexpected response structure`);
    }
  } catch (error) {
    console.error(`Failed to fetch data from ${endpoint}:`, error);
    return null;
  }
};
