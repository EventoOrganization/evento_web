"use client";
import InstagramIcon from "@/components/icons/InstagramIcon";
import LinkedinIcon from "@/components/icons/LinkedinIcon";
import TiktokIcon from "@/components/icons/TiktokIcon";
import Section from "@/components/layout/Section";
import TchatIcon from "@/components/TchatIcon";
import TruncatedText from "@/components/TruncatedText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import UserListModal from "@/components/UserListModal";
import { useSession } from "@/contexts/SessionProvider";
import { useSocket } from "@/contexts/SocketProvider";
import EventSection from "@/features/event/components/EventSection";
import { EventType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { EditIcon, MessageCirclePlusIcon, SettingsIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { startPrivateChat } from "../chat/components/chatsActions";

enum ModalType {
  FOLLOWERS = "followers",
  FOLLOWING = "following",
}

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
  console.log("profile", profile);
  const router = useRouter();
  const pathname = usePathname();
  const [modalType, setModalType] = useState<ModalType | "">("");
  const { conversations, updateConversations, setActiveConversation } =
    useSocket();
  const { user, token } = useSession();
  const platformIcons: Record<string, JSX.Element> = {
    linkedin: <LinkedinIcon />,
    tiktok: <TiktokIcon />,
    instagram: <InstagramIcon />,
  };
  const conversationWithUser = conversations.find(
    (conversation) => conversation.title === profile?.username,
  );
  const handleMessageIconClick = async () => {
    if (conversationWithUser) {
      setActiveConversation(conversationWithUser);
      router.push(`/chats?conversationId=${conversationWithUser._id}`);
    } else if (profile?._id && token) {
      await startPrivateChat(
        profile._id,
        token,
        updateConversations,
        setActiveConversation,
        router,
      );
    }
  };
  return (
    <Section className="gap-6 md:pt-20 md:px-20">
      <div className=" w-full lg:grid lg:grid-cols-4">
        <div className="col-span-3 self-start w-full ">
          <div className="flex items-center w-full justify-between md:pr-20">
            {profile?.profileImage ? (
              <Image
                src={profile?.profileImage}
                alt="user image"
                width={500}
                height={500}
                className="w-20 h-20 md:w-36 md:h-36 object-cover rounded-full"
              />
            ) : (
              <div className="flex flex-col">
                <Avatar className="w-20 h-20 md:w-36 md:h-36">
                  <AvatarImage src="/icon-384x384.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            )}
            <>
              <Button className="h-fit flex flex-col items-center bg-transparent text-black hover:bg-transparent cursor-default">
                <span className="font-bold text-xl">
                  {profile && profile.totalEventAttended !== undefined
                    ? profile.totalEventAttended
                    : 0}
                </span>
                <p>Event Attended</p>
              </Button>
              <Button
                className="h-fit flex flex-col items-center bg-transparent text-black hover:bg-gray-200"
                onClick={() => setModalType(ModalType.FOLLOWING)}
              >
                <span className="font-bold text-xl">
                  {profile && profile.followingUserIds !== undefined
                    ? profile.followingUserIds.length
                    : 0}
                </span>
                <p>Following</p>
              </Button>
            </>
          </div>
          <div className="flex flex-col items-start gap-4 ">
            <ul className=" pt-4 text-start">
              <li className="font-semibold text-xl flex gap-2">
                {profile &&
                  profile.username &&
                  profile.username.charAt(0).toUpperCase() +
                    profile.username.slice(1)}
                {user &&
                  pathname.startsWith("/profile/") &&
                  user._id !== profile?._id && (
                    <span onClick={handleMessageIconClick}>
                      {!conversationWithUser ? (
                        <MessageCirclePlusIcon />
                      ) : (
                        <TchatIcon className="cursor-pointer" pathname />
                      )}
                    </span>
                  )}
              </li>
              {/* <li>{profile && profile.bio && profile.bio}</li> */}

              <TruncatedText
                className="px-0"
                text={(profile && profile.bio && profile.bio) || ""}
                expand
              />
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
        <div>
          {pathname == "/profile" && (
            <ul className="grid grid-cols-3 lg:grid-cols-1 items-center gap-4 my-4 md:p-4">
              <li className="w-full">
                <Link
                  href={"/profile/edit"}
                  className={
                    "w-full inline-flex items-center justify-center gap-4  whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-200/50 h-10 py-2 bg-gray-200 text-black rounded-full px-8"
                  }
                >
                  <span className="hidden sm:block">Edit Profile</span>
                  <EditIcon className="sm:hidden" />
                </Link>
              </li>
              <li className="w-full">
                <Link
                  href={"/profile/settings"}
                  className={
                    "w-full inline-flex items-center justify-center gap-4 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-200/50 h-10 py-2 bg-gray-200 text-black rounded-full px-8"
                  }
                >
                  <span className="hidden sm:block">Settings</span>
                  <SettingsIcon className="sm:hidden" />
                </Link>
              </li>
              <li className="w-full">
                <Button
                  className={
                    "bg-gray-200 text-black rounded-full px-8 hover:bg-gray-200/50 w-full"
                  }
                  onClick={() => setModalType(ModalType.FOLLOWERS)}
                >
                  Followers
                </Button>
              </li>
            </ul>
          )}
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
          </div>
        </div>

        {profile?.interests && profile?.interests?.length > 0 && (
          <div className="md:flex mt-2 items-start hidden gap-2">
            <ul className="flex gap-2">
              {profile.interests.map((interest, index) => (
                <li key={index}>
                  <Button className="bg-evento-gradient text-white">
                    {interest.name}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

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
      <UserListModal
        isOpen={!!modalType}
        closeModal={() => setModalType("")}
        title={modalType === ModalType.FOLLOWING ? "Following" : "Followers"}
        userIds={
          modalType === ModalType.FOLLOWING
            ? profile?.followingUserIds || []
            : profile?.followerUserIds || []
        }
      />
    </Section>
  );
};

export default UserProfile;
