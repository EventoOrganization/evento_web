import { EventType } from "@/types/EventType";
import Script from "next/script";

function StructuredData({ event }: { event: EventType }) {
  if (!event || !event.details) return null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description:
      event.details.description || "Join this amazing event on Evento.",
    url: `https://evento-app.io/events/${event._id}`,
    image:
      event.initialMedia?.[0]?.url ||
      "https://evento-app.io/default-og-image.jpg",
    startDate: event.details.date
      ? `${event.details.date}T${event.details.startTime || "00:00"}:00${
          event.details.timeZone || "Z"
        }`
      : undefined,
    endDate: event.details.endDate
      ? `${event.details.endDate}T${event.details.endTime || "00:00"}:00${
          event.details.timeZone || "Z"
        }`
      : undefined,
    location:
      event.details.mode === "in-person" && event.details.location
        ? {
            "@type": "Place",
            name: event.details.location,
            address: event.details.location,
            geo: {
              "@type": "GeoCoordinates",
              latitude: event.details.loc?.coordinates?.[1] || 0,
              longitude: event.details.loc?.coordinates?.[0] || 0,
            },
          }
        : undefined,
    eventStatus: "https://schema.org/EventScheduled",
    organizer: {
      "@type": "Person",
      name: event.user?.username || "Evento Organizer",
      url: `https://evento-app.io/users/${event.user?._id}`,
    },
    offers: {
      "@type": "Offer",
      url: `https://evento-app.io/events/${event._id}`,
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      strategy="afterInteractive"
    />
  );
}

export default StructuredData;
