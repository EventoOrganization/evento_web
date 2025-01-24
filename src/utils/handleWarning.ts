// src/utils/handleWarning.ts

export type WarningDetails = {
  message: string;
  source?: string;
  context?: any;
  originalError?: any;
};

export const handleWarning = (warning: WarningDetails) => {
  const timestamp = new Date().toISOString();
  console.warn(
    `⚠️ [${timestamp}] Warning from ${warning.source || "Unknown"}:`,
    warning.message,
    warning.originalError || "",
    warning.context || "",
  );
};
