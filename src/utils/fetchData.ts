import { handleError } from "./handleError";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export type FetchDataResult<T> = {
  data: T | null;
  error: string | null;
  status: number;
  ok: boolean;
};
const requestCache = new Map<string, { data: any; timestamp: number }>();
const REQUEST_CACHE_DURATION = 1000; // 1 seconde

export const fetchData = async <T, B = any>(
  endpoint: string,
  method: HttpMethod = HttpMethod.GET,
  body?: B | null,
  token?: string | null,
): Promise<FetchDataResult<T>> => {
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    credentials: "include",
  };

  if (body && method !== HttpMethod.GET) {
    if (body instanceof FormData) {
      fetchOptions.body = body;
    } else {
      headers["Content-Type"] = "application/json";
      fetchOptions.body = JSON.stringify(body);
    }
  }

  const now = Date.now();
  const cachedResponse = requestCache.get(endpoint);

  // 🔥 Vérifie si la réponse est en cache et encore valide
  if (
    cachedResponse &&
    now - cachedResponse.timestamp < REQUEST_CACHE_DURATION
  ) {
    console.log(`⚡ Returning cached response for ${endpoint}`);
    return {
      data: cachedResponse.data,
      error: null,
      status: 200,
      ok: true,
    };
  }

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + endpoint,
      fetchOptions,
    );

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      let errorData = null;

      if (contentType?.includes("application/json")) {
        errorData = await response.json();
        errorMessage = errorData.message || JSON.stringify(errorData);
      } else {
        errorMessage = await response.text();
      }

      handleError(
        {
          message: errorMessage,
          statusCode: response.status,
          source: `fetchData: ${endpoint}`,
          originalError: errorData || null,
        },
        `fetchData: ${endpoint}`,
      );

      return {
        data: null,
        error: errorMessage,
        status: response.status,
        ok: false,
      };
    }

    if (contentType?.includes("application/json")) {
      const json = await response.json();

      // 🔥 Stocke la réponse en cache
      requestCache.set(endpoint, {
        data: json.data || json.body || json,
        timestamp: now,
      });

      return {
        data: json.data || json.body || json,
        error: null,
        status: response.status,
        ok: true,
      };
    }

    return { data: null, error: null, status: response.status, ok: true };
  } catch (error) {
    const formattedError = handleError(error, `fetchData: ${endpoint}`);

    return {
      data: null,
      error: formattedError.message,
      status: formattedError.statusCode || 500,
      ok: false,
    };
  }
};
