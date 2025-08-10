import { EventType, PresetMedia } from "@/types/EventType";

export function derivePresetMediaFromEvent(
  event: EventType | null | undefined,
): PresetMedia[] {
  if (!event) return [];

  const fromImages: PresetMedia[] = (
    Array.isArray(event.details?.images) ? event.details?.images : []
  ).map((url: string, index: number) => ({
    key: `image-${index}`,
    url,
    type: "image",
  }));

  const fromVideos: PresetMedia[] = (
    Array.isArray(event.details?.video) ? event.details?.video : []
  ).map((url: string, index: number) => ({
    key: `video-${index}`,
    url,
    type: "video",
  }));

  return [...fromImages, ...fromVideos];
}
