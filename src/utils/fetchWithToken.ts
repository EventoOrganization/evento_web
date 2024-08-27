import { cookies } from "next/headers";

async function fetchWithToken(url: string, method: string = "GET", body?: any) {
  const tokenCookie = cookies().get("token");
  const token = tokenCookie?.value;

  console.log(
    `Requesting ${method} to ${url} with token ${token || "no token"}`,
  );

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Only add the Authorization header if the token is available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method,
    headers,
    body: method !== "GET" && body ? JSON.stringify(body) : undefined, // Only include body if it's not a GET request and body is provided
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export default fetchWithToken;
