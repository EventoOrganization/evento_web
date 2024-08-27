"use client";
import ComingSoon from "@/components/ComingSoon";
import Section from "@/components/layout/Section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import EventSection from "@/features/event/components/EventSection";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { eventoBtn } from "@/styles/eventoBtn";
import { Event } from "@/types/EventType";
import { User } from "@/types/UserType";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
const UserProfile = ({
  id,
  profile,
  upcomingEvents,
  pastEvents,
  hostingEvents,
  pastHostedEvents,
}: {
  id?: string;
  profile: User;
  upcomingEvents?: Event[];
  pastEvents?: Event[];
  hostingEvents?: Event[];
  pastHostedEvents?: Event[];
}) => {
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    if (!user && !id) {
      useAuthStore.getState().setUser(profile);
    }
  }, []);
  const router = useRouter();
  if (!user) {
    return (
      <>
        <p>No user is logged in.</p>
        <ComingSoon message="This page profile is under construction. Please check back later!" />
      </>
    );
  }

  return (
    <Section className="gap-6 md:mt-20">
      <div className="w-full max-w-xl mx-auto">
        <div className="flex items-center w-full justify-evenly pt-10 pb-4 ">
          {user.profileImage ? (
            <Image
              src={user.profileImage}
              alt="user image"
              width={500}
              height={500}
              className="w-20 h-20 md:w-36 md:h-36 rounded-full"
            />
          ) : (
            <div className="flex flex-col">
              <Avatar className="w-20 h-20 md:w-36 md:h-36">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <ul className="font-semibold pt-4 text-center md:text-xl">
                <li>{user.name || profile.userInfo?.name}</li>
              </ul>
            </div>
          )}
          <div className="flex flex-col items-center">
            <span className="font-bold">
              {user.eventsAttended || profile.countTotalEventIAttended}
            </span>
            <p>Event Attended</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold">
              {user.following || profile.countFollowing}
            </span>
            <p>Following</p>
          </div>
        </div>

        <ul className="flex justify-evenly">
          <li>
            <Button
              className={eventoBtn}
              onClick={() => router.push("/profile/edit")}
            >
              Edit Profile
            </Button>
          </li>
          <li>
            <Button
              className={eventoBtn}
              onClick={() => alert("Share?? que fait l'actuel?")}
            >
              Share Profile
            </Button>
          </li>
          <li>
            <Button
              className={cn(eventoBtn, "p-0 w-10")}
              onClick={() => router.push("/profile/settings")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 11 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.2002 6.8C10.0669 7.33334 9.86676 7.83334 9.6001 8.3C9.4001 8.23334 9.2 8.2 9 8.2C8.7 8.2 8.4001 8.40001 8.1001 8.60001C7.7001 9.00001 7.5998 9.60001 7.7998 10.1C7.33314 10.3667 6.83314 10.5667 6.2998 10.7C6.0998 10.2 5.7001 9.89999 5.1001 9.89999C4.5001 9.89999 4.0999 10.2 3.8999 10.7C3.36657 10.5667 2.86657 10.3667 2.3999 10.1C2.5999 9.60001 2.5001 9.00001 2.1001 8.60001C1.8001 8.40001 1.5002 8.2 1.2002 8.2C1.0002 8.2 0.800098 8.23334 0.600098 8.3C0.333431 7.9 0.133333 7.4 0 6.8C0.5 6.6 0.799805 6.20001 0.799805 5.60001C0.799805 5.00001 0.5 4.59999 0 4.39999C0.133333 3.86666 0.333431 3.36666 0.600098 2.89999C0.800098 2.96666 1.0002 3 1.2002 3C1.5002 3 1.8001 2.80001 2.1001 2.60001C2.5001 2.20001 2.5999 1.60001 2.3999 1.10001C2.86657 0.833339 3.36657 0.633333 3.8999 0.5C4.0999 1 4.5001 1.3 5.1001 1.3C5.7001 1.3 6.0998 1 6.2998 0.5C6.83314 0.633333 7.33314 0.833339 7.7998 1.10001C7.5998 1.60001 7.7001 2.20001 8.1001 2.60001C8.4001 2.80001 8.7 3 9 3C9.2 3 9.4001 2.96666 9.6001 2.89999C9.86676 3.36666 10.0669 3.86666 10.2002 4.39999C9.7002 4.59999 9.3999 5.00001 9.3999 5.60001C9.3999 6.20001 9.7002 6.6 10.2002 6.8ZM7.2998 5.60001C7.2998 4.40001 6.3001 3.5 5.1001 3.5C3.9001 3.5 3 4.40001 3 5.60001C3 6.80001 3.9001 7.7 5.1001 7.7C6.3001 7.7 7.2998 6.80001 7.2998 5.60001Z"
                  fill="white"
                />
              </svg>
            </Button>
          </li>
        </ul>
      </div>
      <EventSection
        title="Upcoming Events"
        events={upcomingEvents}
        sectionStyle="flex flex-col items-start gap-4 p-0 md:bg-muted/50 p-4 lg: max-w-7xl"
        noEventsMessage="There are no events at the moment. Explore Evento and create or host an event easily."
      />
      {!id && (
        <EventSection
          title="Events Hosting"
          events={hostingEvents}
          sectionStyle="flex flex-col items-start gap-4 p-0 md:bg-muted/50 p-4 lg: max-w-7xl"
          noEventsMessage="There are no events at the moment. Explore Evento and create or host an event easily."
        />
      )}
      <EventSection
        title="Past Events Attended"
        events={pastEvents}
        sectionStyle="flex flex-col items-start gap-4 p-0 md:bg-muted/50 p-4 lg: max-w-7xl"
        noEventsMessage="There are no events at the moment. Explore Evento and create or host an event easily."
      />
      {!id && (
        <EventSection
          title="Past Events Hosted"
          events={pastHostedEvents}
          sectionStyle="flex flex-col items-start gap-4 p-0 md:bg-muted/50 p-4 lg: max-w-7xl"
          noEventsMessage="There are no events at the moment. Explore Evento and create or host an event easily."
        />
      )}
    </Section>
  );
};

export default UserProfile;
