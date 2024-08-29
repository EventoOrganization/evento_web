import { getTokenCSR } from "./authUtilsCSR";
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
  console.log(
    `Request sent to ${process.env.NEXT_PUBLIC_API_URL}${endpoint}:`,
    fetchOptions,
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
    console.log(
      `Response from ${endpoint}:`,
      Array.isArray(data) ? "array" : typeof data,
    );
    // console.log(`Full response from ${endpoint}:`, data);
    return data.body || data.data || null;
  } catch (error) {
    console.error(`Failed to fetch data from ${endpoint}:`, error);
    return null;
  }
};
