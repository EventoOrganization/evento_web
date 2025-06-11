export const parseValidDateOrFallback = (
  isoString: string,
  fallback: Date = new Date(),
): Date => {
  if (!isoString || isNaN(new Date(isoString).getTime())) {
    console.warn("Invalid date string:", isoString);
    return fallback;
  }
  return new Date(isoString);
};
