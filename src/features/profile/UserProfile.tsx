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
  // upcomingGuestedEvents,
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
  const [isMounted, setIsMounted] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const pathname = usePathname();
  const isMyProfile = pathname === "/profile";
  useEffect(() => {
    setIsMounted(true);
    if (!profile) {
      setIsFetching(true);
      setTimeout(() => {
        setIsFetching(false);
      }, 1500);
    }
  }, [profile]);
  const isNoEvent =
    !upcomingGoingEvents?.length &&
    !upcomingHostingEvents?.length &&
    !pastGoingEvents?.length &&
    !pastHostedEvents?.length;
  return (
    <>
      {!isMounted || isFetching ? (
        <div className="w-full min-h-screen flex justify-center items-center">
          <EventoLoader />
        </div>
      ) : (
        <>
          <ProfileHeader
            profile={profile}
            totalEvents={
              (upcomingGoingEvents ?? []).length +
                (upcomingHostingEvents ?? []).length +
                (pastGoingEvents ?? []).length +
                (pastHostedEvents ?? []).length || 0
            }
          />
          <Section className="gap-6 max-w-2xl min-h-96">
            {!isMyProfile && isNoEvent && (
              <div className="w-full flex justify-center items-center">
                <p className="text-center text-sm text-muted-foreground">
                  This user isn&apos;t hosting or going to any events at the
                  moment.
                </p>
              </div>
            )}
            {/* 🎯 Upcoming Events */}
            {(isMyProfile ||
              (upcomingGoingEvents?.length ?? 0) > 0 ||
              (upcomingFavouriteEvents?.length ?? 0) > 0) && (
              <EventSection
                title="Upcoming Events"
                events={[
                  ...(upcomingGoingEvents || []),
                  ...(upcomingFavouriteEvents || []),
                ]}
                sectionStyle="flex flex-col items-start gap-4 p-0 lg:max-w-7xl"
                noEventsMessage={
                  isMyProfile
                    ? "There are no upcoming events at the moment."
                    : "This user isn't going to upcoming events at the moment."
                }
              />
            )}

            {/* 🎯 Hosting Events */}
            {(isMyProfile ||
              (upcomingHostingEvents?.length ?? 0) > 0 ||
              (upcomingCoHostedEvents?.length ?? 0) > 0) && (
              <EventSection
                title="Events Hosting"
                events={[
                  ...(upcomingHostingEvents || []),
                  ...(upcomingCoHostedEvents || []),
                ]}
                sectionStyle="flex flex-col items-start gap-4 p-0 lg:max-w-7xl"
                noEventsMessage={
                  isMyProfile
                    ? "There are no hosted events at the moment."
                    : "This user isn't hosting events at the moment."
                }
              />
            )}

            {/* 🎯 Past Events Attended */}
            {(isMyProfile || (pastGoingEvents?.length ?? 0) > 0) && (
              <EventSection
                title="Past Events Attended"
                events={pastGoingEvents || []}
                sectionStyle="flex flex-col items-start gap-4 p-0 lg:max-w-7xl"
                noEventsMessage="There are no past events attended at the moment."
              />
            )}

            {/* 🎯 Past Events Hosted */}
            {(isMyProfile || (pastHostedEvents?.length ?? 0) > 0) && (
              <EventSection
                title="Past Events Hosted"
                events={pastHostedEvents || []}
                sectionStyle="flex flex-col items-start gap-4 p-0 lg:max-w-7xl"
                noEventsMessage={
                  pastHostedEvents?.length === 0
                    ? "There are no past hosted events at the moment."
                    : pastHostedEvents?.length === 1
                      ? "This event is private."
                      : "These events are private."
                }
              />
            )}
          </Section>
        </>
      )}
    </>
  );
};

export default UserProfile;
