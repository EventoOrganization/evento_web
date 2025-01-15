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
  upcomingEvents,
  hostingEvents,
}: {
  profile?: UserType | null;
  upcomingEvents?: EventType[];
  hostingEvents?: EventType[];
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setIsMounted(true);
    if (!profile || !upcomingEvents) {
      setIsFetching(true);
      setTimeout(() => {
        setIsFetching(false);
      }, 1500); // Simule une requête API
    }
  }, [profile, upcomingEvents]);
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
              events={upcomingEvents}
              sectionStyle="flex flex-col items-start gap-4 p-0 lg: max-w-7xl"
              noEventsMessage={
                pathname.startsWith("/profile/")
                  ? "This user isn't going to upcoming events at the moment."
                  : "There are no events at the moment. Explore Evento and create or host an event easily."
              }
            />
            <EventSection
              title="Events Hosting"
              events={hostingEvents}
              sectionStyle="flex flex-col items-start gap-4 p-0 lg: max-w-7xl"
              noEventsMessage={
                pathname.startsWith("/profile/")
                  ? "This user isn't hosting events at the moment."
                  : "There are no events at the moment. Explore Evento and create or host an event easily."
              }
            />
            {profile?.pastEventsGoing &&
              profile?.pastEventsGoing?.length > 0 && (
                <EventSection
                  title="Past Events Attended"
                  events={profile?.pastEventsGoing}
                  sectionStyle="flex flex-col items-start gap-4 p-0  lg: max-w-7xl"
                  noEventsMessage="There are no events at the moment. Explore Evento and create or host an event easily."
                />
              )}
            {profile?.pastEventsHosted &&
              profile?.pastEventsHosted?.length > 0 && (
                <EventSection
                  title="Past Events Hosted"
                  events={profile?.pastEventsHosted}
                  sectionStyle="flex flex-col items-start gap-4 p-0  lg: max-w-7xl"
                  noEventsMessage="There are no events at the moment. Explore Evento and create or host an event easily."
                />
              )}
            {/* <UserListModal
              isOpen={!!modalType}
              closeModal={() => setModalType("")}
              title={
                modalType === ModalType.FOLLOWING ? "Following" : "Followers"
              }
              userIds={
                modalType === ModalType.FOLLOWING
                  ? profile?.followingUserIds || []
                  : profile?.followerUserIds || []
              }
            /> */}
          </Section>
        </>
      )}
    </>
  );
};

export default UserProfile;
