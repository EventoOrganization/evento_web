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

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + endpoint,
      fetchOptions,
    );
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.message || JSON.stringify(errorData);
      } else {
        errorMessage = await response.text();
      }
      return {
        data: null,
        error: errorMessage,
        status: response.status,
        ok: false,
      };
    }

    if (contentType && contentType.includes("application/json")) {
      const json = await response.json();
      return {
        data: json.data || json.body || json,
        error: null,
        status: response.status,
        ok: true,
      };
    }

    // If no content-type is JSON or response is not specified as JSON but is OK
    return { data: null, error: null, status: response.status, ok: true };
  } catch (error) {
    return {
      data: null,
      error: `Failed to fetch data from ${endpoint}: ${error instanceof Error ? error.message : "Unknown error"}`,
      status: 500,
      ok: false,
    };
  }
};
