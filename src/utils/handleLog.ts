// src/utils/handleLog.ts
export type LogOptions = {
  level?: "info" | "debug" | "warn" | "error";
  forceLog?: boolean;
  disableLogs?: boolean;
  context?: any;
};

export const handleLog = (
  message: string,
  options: LogOptions = { level: "info" },
) => {
  const isDev = process.env.NODE_ENV === "development";
  if (options.disableLogs) return;
  if (!isDev && !options.forceLog) return;

  const logMessage = `[${options.level?.toUpperCase()}] ${message}`;

  switch (options.level) {
    case "error":
      console.error(logMessage, options.context || "");
      break;
    case "warn":
      console.warn(logMessage, options.context || "");
      break;
    case "debug":
      console.debug(logMessage, options.context || "");
      break;
    case "info":
    default:
      console.log(logMessage, options.context || "");
      break;
  }
};
