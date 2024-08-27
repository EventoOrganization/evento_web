import { cookies } from "next/headers";

async function fetchWithToken(url: string, method: string = "GET", body?: any) {
  const token = cookies().get("token");

  console.log(`Requesting ${method} to ${url} with token ${token?.value}`);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method,
    headers: {
      Authorization: `Bearer ${token?.value}`,
      "Content-Type": "application/json",
    },
    body: method !== "GET" && body ? JSON.stringify(body) : undefined, // Only include body if it's not a GET request and body is provided
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export default fetchWithToken;
