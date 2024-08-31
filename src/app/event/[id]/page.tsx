"use client";
import ComingSoon from "@/components/ComingSoon";
import { useSession } from "@/contexts/SessionProvider";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const EventPage = () => {
  const { id } = useParams();
  const token = useSession();
  const eventId = Array.isArray(id) ? id[0] : id;
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    if (eventId && !event) {
      fetchEventData(eventId);
    } else if (event) {
      console.log(event);
    }
  }, [eventId, event]);

  const fetchEventData = async (eventId: string) => {
    console.log(eventId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/event/${eventId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      } else {
        console.error("Failed to fetch event data.");
      }
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <ComingSoon message="This page is under construction. Please check back later!" />
  );
};

export default EventPage;
