"use client";
import EventoLoader from "@/components/EventoLoader";

import Section from "@/components/layout/Section";
import EventSection from "@/features/event/components/EventSection";
import { EventType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";

const UserProfile = ({
  profile,
  upcomingGoingEvents,
  upcomingFavouriteEvents,
  upcomingHostingEvents,
  pastGoingEvents,
  pastHostedEvents,
  upcomingCoHostedEvents,
  upcomingGuestedEvents,
}: {
  profile?: UserType | null;
  upcomingGoingEvents?: EventType[];
  upcomingFavouriteEvents?: EventType[];
  upcomingRefusedEvents?: EventType[];
  upcomingGuestedEvents?: EventType[];
  upcomingHostingEvents?: EventType[];
  upcomingCoHostedEvents?: EventType[];
  pastHostedEvents?: EventType[];
  pastGoingEvents?: EventType[];
}) => {
  console.log("profileData", upcomingGoingEvents);
  const [isMounted, setIsMounted] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setIsMounted(true);
    if (!profile) {
      setIsFetching(true);
      setTimeout(() => {
        setIsFetching(false);
      }, 1500);
    }
  }, [profile]);
  console.log("upcomingGuestedEvents", upcomingGuestedEvents);
  return (
    <>
      {!isMounted || isFetching ? (
        <div className="w-full min-h-screen flex justify-center items-center">
          <EventoLoader />
        </div>
      ) : (
        <>
          <ProfileHeader profile={profile} />
          <Section className="gap-6 max-w-2xl">
            <EventSection
              title="Upcoming Events"
              events={[
                ...(upcomingGoingEvents || []),
                ...(upcomingFavouriteEvents || []),
              ]}
              sectionStyle="flex flex-col items-start gap-4 p-0 lg: max-w-7xl"
              noEventsMessage={
                pathname.startsWith("/profile/")
                  ? "This user isn't going to upcoming events at the moment."
                  : "There are no events at the moment. Explore Evento and create or host an event easily."
              }
            />
            <EventSection
              title="Events Hosting"
              events={[
                ...(upcomingHostingEvents || []),
                ...(upcomingCoHostedEvents || []),
              ]}
              sectionStyle="flex flex-col items-start gap-4 p-0 lg: max-w-7xl"
              noEventsMessage={
                pathname.startsWith("/profile/")
                  ? "This user isn't hosting events at the moment."
                  : "There are no events at the moment. Explore Evento and create or host an event easily."
              }
            />
            <EventSection
              title="Past Events Attended"
              events={
                pastGoingEvents
                  ? pastGoingEvents
                  : profile?.pastEventsGoing
                    ? profile?.pastEventsGoing
                    : []
              }
              sectionStyle="flex flex-col items-start gap-4 p-0  lg: max-w-7xl"
              noEventsMessage="There are no events at the moment. Explore Evento and create or host an event easily."
            />
            <EventSection
              title="Past Events Hosted"
              events={
                pastHostedEvents
                  ? pastHostedEvents
                  : profile?.pastEventsHosted
                    ? profile?.pastEventsHosted
                    : []
              }
              sectionStyle="flex flex-col items-start gap-4 p-0  lg: max-w-7xl"
              noEventsMessage="There are no events at the moment. Explore Evento and create or host an event easily."
            />
          </Section>
        </>
      )}
    </>
  );
};

export default UserProfile;
