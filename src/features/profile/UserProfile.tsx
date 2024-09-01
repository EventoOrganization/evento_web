"use client";
import ComingSoon from "@/components/ComingSoon";
import Section from "@/components/layout/Section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import EventSection from "@/features/event/components/EventSection";
import { useAuthStore } from "@/store/useAuthStore";
import { eventoBtn } from "@/styles/eventoBtn";
import { UserType } from "@/types/UserType";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { EventType } from "react-hook-form";
const UserProfile = ({
  id,
  profile,
  upcomingEvents,
  pastEvents,
  hostingEvents,
  pastHostedEvents,
}: {
  id?: string;
  profile: UserType;
  upcomingEvents?: EventType[];
  pastEvents?: EventType[];
  hostingEvents?: EventType[];
  pastHostedEvents?: EventType[];
}) => {
  const user = useAuthStore((state) => state.user);
  console.log("profile", profile);
  // console.log("upcomingEvents", upcomingEvents);
  // console.log("pastEvents", pastEvents);
  // console.log("hostingEvents", hostingEvents);
  // console.log("pastHostedEvents", pastHostedEvents);
  // console.log("profile", profile);

  useEffect(() => {
    if (!user && !id) {
      useAuthStore.getState().setUser(profile);
    }
  }, []);
  const router = useRouter();
  if (!user) {
    return (
      <>
        <p>No user is logged in. Please log in. </p>
        <Link href="/signin">Login here</Link>
        <ComingSoon message="This page profile is under construction. Please check back later!" />
      </>
    );
  }

  return (
    <Section className="gap-6 md:mt-20 md:px-20">
      <div className=" w-full lg:grid lg:grid-cols-3">
        <div className="col-span-2 self-start w-full max-w-lg">
          <div className="flex items-center w-full justify-between pt-10 pb-4 ">
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
              </div>
            )}
            <div className="flex flex-col items-center">
              <span className="font-bold text-xl">
                {profile && profile.totalEventAttended}{" "}
                {profile && profile.countTotalEventIAttended}
              </span>
              <p>Event Attended</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-xl">
                {profile && profile.following}
                {profile && profile.countFollowing}
              </span>
              <p>Following</p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-4">
            <ul className=" pt-4 text-start">
              <li className="font-semibold md:text-xl">
                {user.name ||
                  (profile && profile.userInfo?.name && profile.userInfo?.name)}
              </li>
              <li>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nulla,
                non illum? Quibusdam nulla nostrum molestias.
              </li>
              <li>
                <Link
                  href="https://dfranck.netlify.app/ "
                  className="underline text-blue-400"
                >
                  https://dfranck.netlify.app/
                </Link>
              </li>
            </ul>
            <ul className="flex justify-evenly gap-4">
              <li>
                <Button
                  className={"bg-gray-200 text-black rounded-full px-8"}
                  onClick={() => router.push("/profile/edit")}
                >
                  Edit Profile
                </Button>
              </li>
              <li>
                <Button
                  className={"bg-gray-200 text-black rounded-full px-8"}
                  onClick={() => alert("Share?? que fait l'actuel?")}
                >
                  Settings
                </Button>
              </li>
            </ul>
          </div>
        </div>
        <div className="hidden lg:flex flex-col">
          <h3 className="mb-4 text-eventoPurpleLight">Following Suggestions</h3>
          <ul className="w-full flex flex-col gap-4">
            <li className="w-full flex justify-between">
              <span className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                Suggest{" "}
              </span>
              <Button className={eventoBtn}>Follow</Button>
            </li>
            <li className="w-full flex justify-between">
              <span className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                Suggest{" "}
              </span>
              <Button className={"bg-gray-200 text-black rounded-full px-5"}>
                Following
              </Button>
            </li>
            <li className="w-full flex justify-between">
              <span className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                Suggest{" "}
              </span>
              <Button className={eventoBtn}>Follow</Button>
            </li>
          </ul>
        </div>
      </div>
      <EventSection
        title="Upcoming Events"
        events={upcomingEvents}
        sectionStyle="flex flex-col items-start gap-4 p-0 lg: max-w-7xl"
        noEventsMessage="There are no events at the moment. Explore Evento and create or host an event easily."
      />
      <EventSection
        title="Events Hosting"
        events={hostingEvents}
        sectionStyle="flex flex-col items-start gap-4 p-0 lg: max-w-7xl"
        noEventsMessage="There are no events at the moment. Explore Evento and create or host an event easily."
      />
      {pastEvents && pastEvents?.length > 0 && (
        <EventSection
          title="Past Events Attended"
          events={pastEvents}
          sectionStyle="flex flex-col items-start gap-4 p-0  lg: max-w-7xl"
          noEventsMessage="There are no events at the moment. Explore Evento and create or host an event easily."
        />
      )}
      {pastHostedEvents && pastHostedEvents?.length > 0 && (
        <EventSection
          title="Past Events Hosted"
          events={pastHostedEvents}
          sectionStyle="flex flex-col items-start gap-4 p-0  lg: max-w-7xl"
          noEventsMessage="There are no events at the moment. Explore Evento and create or host an event easily."
        />
      )}
    </Section>
  );
};

export default UserProfile;
