export const SUPPORTED_IMAGE_SIZES = [
  { label: "Square", value: 1 },
  { label: "Portrait", value: 0.8 },
  { label: "Landscape", value: 1.91 },
] as const;

export type SupportedAspectRatioOptions = typeof SUPPORTED_IMAGE_SIZES;
export type SupportedAspectRatioOption = SupportedAspectRatioOptions[number];
