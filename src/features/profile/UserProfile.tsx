"use client";
import InstagramIcon from "@/components/icons/InstagramIcon";
import LinkedinIcon from "@/components/icons/LinkedinIcon";
import TiktokIcon from "@/components/icons/TiktokIcon";
import Section from "@/components/layout/Section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import EventSection from "@/features/event/components/EventSection";
import { EventType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
const UserProfile = ({
  profile,
  upcomingEvents,
  pastEvents,
  hostingEvents,
  pastHostedEvents,
}: {
  profile?: UserType | null;
  upcomingEvents?: EventType[];
  pastEvents?: EventType[];
  hostingEvents?: EventType[];
  pastHostedEvents?: EventType[];
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const platformIcons: Record<string, JSX.Element> = {
    linkedin: <LinkedinIcon />,
    tiktok: <TiktokIcon />,
    instagram: <InstagramIcon />,
  };
  return (
    <Section className="gap-6 md:pt-20 md:px-20">
      <div className=" w-full lg:grid lg:grid-cols-3">
        <div className="col-span-2 self-start w-full max-w-lg">
          <div className="flex items-center w-full justify-between ">
            {profile?.profileImage ? (
              <Image
                src={profile?.profileImage}
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
            <>
              <div className="flex flex-col items-center">
                <span className="font-bold text-xl">
                  {profile && profile.totalEventAttended !== undefined
                    ? profile.totalEventAttended
                    : 0}
                </span>
                <p>Event Attended</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-xl">
                  {profile && profile.following !== undefined
                    ? profile.following
                    : 0}
                </span>
                <p>Following</p>
              </div>
            </>
          </div>
          <div className="flex flex-col items-start gap-4 ">
            <ul className=" pt-4 text-start">
              <li className="font-semibold text-xl">
                {profile && profile.username && profile.username}
              </li>
              <li>{profile && profile.bio && profile.bio}</li>
              {profile && profile.URL && (
                <li>
                  <Link
                    href={profile.URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline text-sm"
                  >
                    {profile.URL}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-2 flex gap-10 justify-between">
          {profile?.socialLinks && profile?.socialLinks?.length > 0 && (
            <div className="flex flex-col items-start gap-4">
              <h4 className="hidden md:block">Social Links</h4>
              {profile?.socialLinks?.length > 0 && (
                <ul className="flex md:flex-col gap-4">
                  {profile.socialLinks.map((link, index) => (
                    <li key={index} className="">
                      <Link
                        className=""
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {platformIcons[link.platform.toLowerCase()]}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {profile?.interest && profile?.interest?.length > 0 && (
            <div className="md:flex flex-col items-start hidden gap-4">
              <h4 className="hidden md:block">Interests</h4>
              <ul className="flex lg:flex-col gap-4">
                {profile.interest.map((interest, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 bg-evento-gradient text-white px-2 py-1 m-1 rounded h-10"
                  >
                    {interest.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
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
      {pathname == "/profile" && (
        <ul className="flex justify-evenly items-center gap-4">
          <li>
            <Button
              className={
                "bg-gray-200 text-black rounded-full px-8 hover:bg-gray-200/50 "
              }
              onClick={() => router.push("/profile/edit")}
            >
              Edit Profile
            </Button>
          </li>
          <li>
            <Link
              href={"/profile/settings"}
              className={
                "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-200/50 h-10 py-2 bg-gray-200 text-black rounded-full px-8"
              }
            >
              Settings
            </Link>
          </li>
        </ul>
      )}
    </Section>
  );
};

export default UserProfile;
