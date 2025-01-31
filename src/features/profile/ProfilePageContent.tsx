"use client";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import StaticProfilePage from "@/features/profile/StaticProfilePage";
import UserProfile from "@/features/profile/UserProfile";
import { useEventStore } from "@/store/useEventsStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useState } from "react";

// 🏷️ Définition du type Event
interface Event {
  _id: string;
  user: { _id: string };
  isGoing?: boolean;
  isFavourite?: boolean;
  isRefused?: boolean;
  guests?: { _id: string }[];
  coHosts?: { userId?: { _id: string } }[];
  details?: {
    date?: string;
    endDate?: string;
  };
}

export default function ProfilePageContent() {
  const session = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { userInfo, loadUser } = useProfileStore();
  const { events } = useEventStore();

  // 📆 Date actuelle
  const currentDate = new Date();

  const isUpcomingOrOngoing = (event: Event) => {
    if (!event.details?.date || !event.details?.endDate) return false;

    const eventStart = new Date(event.details.date);
    const eventEnd = new Date(event.details.endDate);

    return (
      eventStart > currentDate ||
      (eventStart <= currentDate && eventEnd > currentDate)
    );
  };

  const upcomingHostingEvents = events.filter(
    (event: Event) =>
      event.user._id === userInfo?._id && isUpcomingOrOngoing(event),
  );

  const upcomingGoingEvents = events.filter(
    (event: Event) => event.isGoing && isUpcomingOrOngoing(event),
  );

  const upcomingFavouriteEvents = events.filter(
    (event: Event) => event.isFavourite && isUpcomingOrOngoing(event),
  );

  const upcomingRefusedEvents = events.filter(
    (event: Event) => event.isRefused && isUpcomingOrOngoing(event),
  );

  const upcomingGuestedEvents = events.filter(
    (event: Event) =>
      event.guests?.some((guest) => guest._id === userInfo?._id) &&
      isUpcomingOrOngoing(event),
  );

  const upcomingCoHostedEvents = events.filter(
    (event: Event) =>
      event.coHosts?.some((coHost) => coHost.userId?._id === userInfo?._id) &&
      isUpcomingOrOngoing(event),
  );

  // **2️⃣ PAST EVENTS** (événements terminés)
  const pastHostedEvents = events.filter(
    (event: Event) =>
      event.user._id === userInfo?._id &&
      event.details?.endDate &&
      new Date(event.details.endDate) <= currentDate,
  );

  const pastGoingEvents = events.filter(
    (event: Event) =>
      event.isGoing &&
      event.details?.endDate &&
      new Date(event.details.endDate) <= currentDate,
  );
  return (
    <>
      {session.isAuthenticated ? (
        <UserProfile
          profile={userInfo}
          upcomingGoingEvents={upcomingGoingEvents}
          upcomingFavouriteEvents={upcomingFavouriteEvents}
          upcomingRefusedEvents={upcomingRefusedEvents}
          upcomingGuestedEvents={upcomingGuestedEvents}
          upcomingHostingEvents={upcomingHostingEvents}
          upcomingCoHostedEvents={upcomingCoHostedEvents}
          pastHostedEvents={pastHostedEvents}
          pastGoingEvents={pastGoingEvents}
        />
      ) : (
        <StaticProfilePage
          setIsAuthModalOpen={() => setIsAuthModalOpen(true)}
        />
      )}
      {isAuthModalOpen && (
        <AuthModal
          onAuthSuccess={(token?: string) => {
            if (token) loadUser(token);
          }}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </>
  );
}
