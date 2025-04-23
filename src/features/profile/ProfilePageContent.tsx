"use client";
import AuthModal from "@/components/system/auth/AuthModal";
import { useSession } from "@/contexts/(prod)/SessionProvider";
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
  const [isSigninModalOpen, setIsSigninModalOpen] = useState(false);
  const { userInfo, loadUser } = useProfileStore();
  const { events, eventsStatus } = useEventStore();
  // 📆 Date actuelle
  const currentDate = new Date();
  const getEventStatus = (eventId: string) => eventsStatus[eventId] || {};

  const isUpcomingOrOngoing = (event: Event) => {
    if (!event.details?.date || !event.details?.endDate) return false;

    const eventStart = new Date(event.details.date);
    const eventEnd = new Date(event.details.endDate);

    return (
      eventStart > currentDate ||
      (eventStart <= currentDate && eventEnd > currentDate)
    );
  };

  const upcomingHostingEvents = events
    .filter(
      (event: Event) =>
        event.user._id === userInfo?._id && isUpcomingOrOngoing(event),
    )
    .sort((a, b) => {
      const dateA = a.details?.date
        ? new Date(a.details.date).getTime()
        : Number.MAX_SAFE_INTEGER;
      const dateB = b.details?.date
        ? new Date(b.details.date).getTime()
        : Number.MAX_SAFE_INTEGER;
      return dateA - dateB;
    });

  const upcomingGoingEvents = events
    .filter(
      (event: Event) =>
        getEventStatus(event._id).isGoing && isUpcomingOrOngoing(event),
    )
    .sort((a, b) => {
      const dateA = a.details?.date
        ? new Date(a.details.date).getTime()
        : Number.MAX_SAFE_INTEGER;
      const dateB = b.details?.date
        ? new Date(b.details.date).getTime()
        : Number.MAX_SAFE_INTEGER;
      return dateA - dateB;
    });

  const upcomingFavouriteEvents = events.filter(
    (event: Event) =>
      getEventStatus(event._id).isFavourite && isUpcomingOrOngoing(event),
  );

  const upcomingRefusedEvents = events.filter(
    (event: Event) =>
      getEventStatus(event._id).isRefused && isUpcomingOrOngoing(event),
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
          setIsSigninModalOpen={setIsSigninModalOpen}
        />
      )}
      {isAuthModalOpen && (
        <AuthModal
          onAuthSuccess={(token?: string) => {
            if (token) loadUser(token);
          }}
          defaultForm={isSigninModalOpen ? "login" : "signup"}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </>
  );
}
