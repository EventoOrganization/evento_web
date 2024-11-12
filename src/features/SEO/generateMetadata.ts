import { EventType } from "@/types/EventType";
import { Metadata } from "next";

export async function generateMetadata(
  event?: EventType | null,
): Promise<Metadata> {
  if (!event) {
    return {
      title: "Evento",
      description: "Discover and join amazing events on Evento.",
    };
  }

  const eventTitle = event.title;
  const eventDescription =
    event.details?.description ?? "Join this amazing event on Evento.";

  return {
    title: `${eventTitle} - Evento`,
    description: eventDescription,
    openGraph: {
      type: "website",
      url: `https://evento-app.io/events/${event._id}`,
      title: eventTitle,
      description: eventDescription,
      siteName: "Evento",
      images: [
        {
          url:
            event.initialMedia?.[0]?.url ??
            "https://evento-app.io/default-og-image.jpg",
          width: 1200,
          height: 675,
          alt: `${eventTitle} - Evento`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@eventoapp",
      creator: "@eventoapp",
      title: eventTitle,
      description: eventDescription,
      images: [
        event.initialMedia?.[0]?.url ??
          "https://evento-app.io/default-og-image.jpg",
      ],
    },
  };
}
