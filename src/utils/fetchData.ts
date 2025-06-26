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
  baseUrl?: string,
): Promise<FetchDataResult<T>> => {
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const fetchOptions: RequestInit = { method, headers, credentials: "include" };

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

  if (
    cachedResponse &&
    now - cachedResponse.timestamp < REQUEST_CACHE_DURATION
  ) {
    return { data: cachedResponse.data, error: null, status: 200, ok: true };
  }

  try {
    const url = `${baseUrl ?? process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

    const response = await fetch(url, fetchOptions);
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const errorMessage = contentType?.includes("application/json")
        ? (await response.json()).message
        : await response.text();

      handleError(
        { message: errorMessage, statusCode: response.status },
        `fetchData: ${endpoint}`,
      );
      return {
        data: null,
        error: errorMessage,
        status: response.status,
        ok: false,
      };
    }

    const extractData = (json: any) => {
      if ("data" in json) return json.data;
      if ("body" in json) return json.body;
      return json;
    };

    const json = await response.json();
    const extracted = extractData(json);

    requestCache.set(endpoint, { data: extracted, timestamp: now });

    return {
      data: extracted,
      error: null,
      status: response.status,
      ok: true,
    };
  } catch (error) {
    const formatted = handleError(error, `fetchData: ${endpoint}`);
    return {
      data: null,
      error: formatted.message,
      status: formatted.statusCode || 500,
      ok: false,
    };
  }
};
