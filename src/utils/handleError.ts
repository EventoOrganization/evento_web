import { toast } from "@/hooks/use-toast";

export type AppError = {
  message: string;
  statusCode?: number;
  source?: string;
  originalError?: any;
};

/**
 * Function to handle errors globally
 */
export const handleError = (error: any, source: string = "Unknown") => {
  console.error(`🚨 Error from [${source}]:`, error);

  const formattedError: AppError = {
    message: "An unexpected error occurred.",
    source,
    originalError: error,
  };

  if (error?.response?.data) {
    formattedError.message = error.response.data.message || "API error.";
    formattedError.statusCode = error.response.status;
  } else if (
    error instanceof TypeError &&
    error.message === "Failed to fetch"
  ) {
    formattedError.message = "Please check your internet or switch browser.";
  } else if (error?.message && error?.name === "FetchError") {
    formattedError.message = "Network error. Please check your connection.";
  } else if (typeof error === "string") {
    formattedError.message = error;
  } else if (error?.message) {
    formattedError.message = error.message;
  }

  toast({
    title: `Error in ${source}`,
    description: formattedError.message,
    variant: "destructive",
  });

  return formattedError;
};
