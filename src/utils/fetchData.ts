import { handleError } from "./handleError";
import { handleWarning } from "./handleWarning";

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

const requestTimestamps = new Map<string, number>();
const REQUEST_COOLDOWN = 1000;

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
  const lastRequestTime = requestTimestamps.get(endpoint) || 0;

  if (now - lastRequestTime < REQUEST_COOLDOWN) {
    handleWarning({
      message: `⏳ Request blocked (cooldown active: ${REQUEST_COOLDOWN}ms)`,
      source: `fetchData: ${endpoint}`,
      context: { endpoint, lastRequestTime, now },
    });

    return {
      data: null,
      error: "Request blocked: cooldown active",
      status: 429,
      ok: false,
    };
  }

  requestTimestamps.set(endpoint, now);

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
      status: 500,
      ok: false,
    };
  }
};
