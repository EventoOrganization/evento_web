import Section from "@/components/layout/Section";
import EventIdTabs from "@/features/event/components/EventIdTabs";
import { EventType } from "@/types/EventType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { Metadata } from "next";

type Props = {
  params: { id: string };
};

// Fonction pour récupérer les données d'un événement côté serveur
async function fetchEventData(eventId: string): Promise<EventType | null> {
  try {
    const response = await fetchData<EventType>(
      `/events/getEvent/${eventId}`,
      HttpMethod.GET,
      null,
      null,
    );
    return response.data || null;
  } catch (error) {
    console.error("Error fetching event data:", error);
    return null;
  }
}

// Générer dynamiquement les métadonnées
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await fetchEventData(params.id);
  console.log("event", event);
  if (!event) {
    return {
      title: "Event ",
      description: "This event could not be found on Evento.",
    };
  }

  return {
    title: `${event.title}`,
    description:
      event.details?.description || "Join this amazing event on Evento",
    openGraph: {
      title: event.title,
      description: event.details?.description,
      images: [
        {
          url:
            event.initialMedia?.[0]?.url ||
            "https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.details?.description,
      images: [
        {
          url:
            event.initialMedia?.[0]?.url ||
            "https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
    },
  };
}

// Composant principal de la page événement
export default async function EventPage({ params }: Props) {
  const event = await fetchEventData(params.id);

  if (!event) {
    return (
      <Section>
        <p>Event not found</p>
      </Section>
    );
  }

  return <EventIdTabs evento={event} />;
}
