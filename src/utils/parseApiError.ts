/**
 * Extracts a human-readable error message from an unknown error or fetch Response.
 */
export const parseApiError = async (
  error: unknown,
  fallbackMessage = "An unexpected error occurred",
): Promise<string> => {
  // Si c’est une Response (ex: fetch renvoyé une 4xx/5xx)
  if (error instanceof Response) {
    try {
      const contentType = error.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const json = await error.json();
        return json?.message || json?.error || fallbackMessage;
      }

      const text = await error.text();
      if (!text.includes("<!DOCTYPE html>") && text.length < 300) {
        return text;
      }
    } catch (e) {
      return fallbackMessage;
    }
  }

  // Si c’est une Error classique
  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  // Si c’est un string (parfois throwé directement)
  if (typeof error === "string") {
    return error;
  }

  return fallbackMessage;
};
