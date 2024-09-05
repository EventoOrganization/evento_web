"use client";
import Section from "@/components/layout/Section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import EventSection from "@/features/event/components/EventSection";
import { eventoBtn } from "@/styles/eventoBtn";
import { EventType } from "@/types/EventType";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
const UserProfile = ({
  id,
  profile,
  upcomingEvents,
  pastEvents,
  hostingEvents,
  pastHostedEvents,
}: {
  id?: string;
  profile?: any;
  upcomingEvents?: EventType[];
  pastEvents?: EventType[];
  hostingEvents?: EventType[];
  pastHostedEvents?: EventType[];
}) => {
  // console.log("User profile:", profile);
  // console.log("id", id);
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Section className="gap-6 md:mt-20 md:px-20">
      <div className=" w-full lg:grid lg:grid-cols-3">
        <div className="col-span-2 self-start w-full max-w-lg">
          <div className="flex items-center w-full justify-between pt-10 pb-4 ">
            {/* {profile?.userInfo?.profileImage ? (
              <Image
                src={profile?.userInfo?.profileImage}
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
            )}{" "} */}
            <Avatar className="w-20 h-20 md:w-36 md:h-36">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
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
                {profile && profile.userInfo?.name && profile.userInfo?.name}
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
            {pathname == "/profile" && (
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
                  <Link
                    href={"/profile/settings"}
                    className={"bg-gray-200 text-black rounded-full px-8"}
                  >
                    Settings
                  </Link>
                </li>
              </ul>
            )}
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
