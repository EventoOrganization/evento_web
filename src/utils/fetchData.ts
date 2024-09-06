export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export type FetchDataResult<T> = {
  data: T | null;
  error: string | null;
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
    console.log("fetching", process.env.NEXT_PUBLIC_API_URL + endpoint, token);
    console.log("fetchOptions:", fetchOptions);
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + endpoint,
      fetchOptions,
    );

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();

        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else {
        const errorText = await response.text();
        errorMessage = `HTTP error! status: ${response.status}, message: ${errorText}`;
      }

      return {
        data: null,
        error: errorMessage,
      };
    }

    if (contentType && contentType.includes("application/json")) {
      const data: { success: boolean; body?: T; data?: T; message?: string } =
        await response.json();

      if (data?.body) {
        return { data: data.body as T, error: null };
      } else if (data?.data) {
        return { data: data.data as T, error: null };
      } else if (data?.message) {
        return { data: null, error: data.message };
      } else {
        return { data: data as T, error: null };
      }
    } else {
      throw new Error("La réponse n'est pas au format JSON.");
    }
  } catch (error) {
    return {
      data: null,
      error: `Failed to fetch data from ${endpoint}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};
