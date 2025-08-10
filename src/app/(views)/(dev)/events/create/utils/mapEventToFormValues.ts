import { EventFormValuesType, EventType } from "@/types/EventType";
import { getUTCOffset } from "@/utils/timezones";
import { derivePresetMediaFromEvent } from "./derivePresetMediaFromEvent";

export function mapEventToFormValues(
  event: EventType,
  usernameFallback: string,
): EventFormValuesType {
  const tz = event.details?.timeZone || getUTCOffset();

  return {
    // required + defaults
    username: usernameFallback,
    title: event.title || "",
    description: event.details?.description || "",
    eventType: (event.eventType as "public" | "private") || "public",
    mode:
      (event.details?.mode as "virtual" | "in-person" | "both") || "in-person",
    timeZone: tz,
    date: event.details?.date || new Date().toISOString(),
    endDate: event.details?.endDate || new Date().toISOString(),
    startTime: event.details?.startTime || "08:00",
    location: event.details?.location || "",
    latitude: String(event.details?.loc?.coordinates?.[1] ?? ""),
    longitude: String(event.details?.loc?.coordinates?.[0] ?? ""),
    restricted: !!event.restricted,

    // optional
    endTime: event.details?.endTime || "",
    timeSlots: event.details?.timeSlots || [],
    interests: event.interests || [],

    // more options
    coHosts: event.coHosts || [],
    includeChat: !!event.details?.includeChat,
    UrlLink: event.details?.URLlink || "",
    UrlTitle: event.details?.URLtitle || "",
    limitedGuests: event.limitedGuests ?? null,
    requiresApproval: !!event.requiresApproval,
    createRSVP: !!event.details?.createRSVP,
    questions: event.questions || [],
    additionalField: event.additionalField || [],

    // media (duplication = pas d'upload initial, on réutilise en predefined)
    toUploadFiles: [],
    predefinedMedia: derivePresetMediaFromEvent(event),

    // ticketing (si pas présent côté API)
    ticketing: event.ticketing ?? {
      enabled: false,
      totalTickets: 0,
      price: 0,
      currency: "eur",
      payoutStripeAccountId: "",
    },
  };
}
