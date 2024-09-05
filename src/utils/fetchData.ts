// Enum to define allowed HTTP methods
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

// Define the structure of the returned object
export type FetchDataResult<T> = {
  data: T | null; // Contains the data if the request is successful
  error: string | null; // Contains the error message if the request fails
};

// Generic fetchData function that works in both SSR and CSR
export const fetchData = async <T, B = any>(
  endpoint: string, // API endpoint
  method: HttpMethod = HttpMethod.GET, // HTTP method, default to GET
  body?: Partial<B>, // Generic request body type
  options: RequestInit = {}, // Additional fetch options
  token?: string | null, // CSR token, passed from the client side
): Promise<FetchDataResult<T>> => {
  // Setting headers for the request
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>), // Merge with any custom headers
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`; // Include token in headers if available
  }

  // Prepare fetch options
  const fetchOptions: RequestInit = {
    ...options,
    method,
    credentials: "include", // Include credentials if necessary
    headers,
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body); // Stringify body if provided
  }

  try {
    // Perform the API request
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + endpoint,
      fetchOptions,
    );

    // Handle non-OK responses
    if (!response.ok) {
      const errorMessage = await response.text();
      return {
        data: null,
        error: `HTTP error! status: ${response.status}, message: ${errorMessage}`,
      };
    }

    // Parse the JSON response
    const data: { success: boolean; body?: T; data?: T } =
      await response.json();

    console.log(data);
    // Return the parsed data
    if (data?.body) {
      return { data: data.body as T, error: null };
    } else if (data?.data) {
      return { data: data.data as T, error: null };
    } else {
      return { data: data as T, error: null };
    }
  } catch (error) {
    // Catch any network or unexpected errors
    return {
      data: null,
      error: `Failed to fetch data from ${endpoint}: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
};
