import LinkedinIcon from "@/components/icons/LinkedinIcon";
import TiktokIcon from "@/components/icons/TiktokIcon";
import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import UserListModal from "@/components/UserListModal";
import { useSession } from "@/contexts/SessionProvider";
import { toast } from "@/hooks/use-toast";
import { useUsersStore } from "@/store/useUsersStore";
import { InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { Pencil, Settings, UserRoundPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AuthModal from "../auth/components/AuthModal";
interface Props {
  profile: UserType | null | undefined;
  totalEvents: number;
}
enum ModalType {
  FOLLOWERS = "followers",
  FOLLOWING = "following",
}
const platformIcons: Record<string, JSX.Element> = {
  linkedin: <LinkedinIcon />,
  tiktok: <TiktokIcon />,
  instagram: (
    <Image
      src={"/Instagram_logo_2022.png"}
      alt="Instagram_logo_2022"
      width={40}
      height={40}
      className="w-full h-full"
    />
  ),
};
const ProfileHeader = ({ profile, totalEvents }: Props) => {
  const pathname = usePathname();
  const { token, user } = useSession();
  console.log(
    "TOTAL EVENTs",
    profile?.upcomingEvents?.length,
    profile?.pastEventsGoing,
  );
  console.log("PROFILE", profile);
  const { updateUser } = useUsersStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isIFollowingHim, setIsIFollowingHim] = useState<boolean | null>(
    profile?.followerUserIds?.includes(user?._id ?? "") ?? null,
  );
  const isFollowingMe = profile?.followingUserIds?.includes(
    (user && user._id) || "",
  );
  const [modalType, setModalType] = useState<ModalType | "">("");
  const interests: InterestType[] = profile?.interests || [];
  const socialLinks = profile?.socialLinks || [];
  const handleFollow = async () => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/follow`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ followingId: profile?._id }),
        },
      );

      if (response.ok) {
        setIsIFollowingHim((prevIsFollowing) => !prevIsFollowing);
        const updatedStatus = !isIFollowingHim;
        updateUser({ _id: profile?._id, isIFollowingHim: updatedStatus });
        toast({
          title: "Success",
          description: `You are now ${!isIFollowingHim ? "following" : "unfollowing"} this user`,
          duration: 2000,
          className: "bg-evento-gradient text-white",
        });
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Section className="text-sm gap-2 border-b-2 py-6 max-w-2xl">
        <div className="flex justify-between w-full items-center">
          <figure>
            <Image
              src={profile?.profileImage || "/evento-logo.png"}
              alt="user profile image"
              width={500}
              height={500}
              className="w-24 h-24 md:w-36 md:h-36 object-cover rounded-full"
              priority
            />
          </figure>
          <div className="flex flex-col justify-end">
            <div className="flex items-center gap-2 px-4">
              <span className="font-bold text-base">
                {totalEvents ? totalEvents : 0}
              </span>
              <p>Events</p>
            </div>
            <Button
              className="gap-2 w-fit self-end"
              variant={"ghost"}
              onClick={() => setModalType(ModalType.FOLLOWING)}
            >
              <span className="font-bold text-base">
                {profile && profile.followingUserIds !== undefined
                  ? profile.followingUserIds.length
                  : 0}
              </span>
              <p>Following</p>
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-full mt-2">
          <h3>{profile?.username}</h3>
          <p>{profile?.bio}</p>
          <p className="text-muted-foreground">{profile?.address}</p>
          <Link
            href={profile?.URL ?? ""}
            target="_blank"
            className="text-eventoPurpleLight"
          >
            {profile?.URL}
          </Link>
        </div>
        {interests && interests.length > 0 && (
          <div className="flex flex-wrap gap-2 w-full">
            {interests.map((interest) => (
              <span
                key={interest._id}
                className={`px-2 py-1 rounded-md border text-sm w-fit flex items-center justify-center bg-muted text-black`}
              >
                {interest.name}
              </span>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center w-full ">
          {socialLinks && socialLinks?.length > 0 ? (
            <div className="flex flex-col items-start w-full">
              {socialLinks?.length > 0 && (
                <ul className="flex gap-2">
                  {socialLinks.map((link, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-center w-10 h-10"
                    >
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
          ) : (
            <div></div>
          )}{" "}
          {user?._id !== profile?._id && (
            <Button
              variant={"ghost"}
              className={` px-5 py-2 rounded-lg font-semibold text-white transition-all hover:scale-105 duration-300 hover:text-white
        ${isIFollowingHim && !isFollowingMe ? "bg-gray-400 hover:bg-gray-500 " : ""}
        ${isFollowingMe && !isIFollowingHim ? "bg-eventoBlue hover:bg-eventoBlue/80 " : ""}
        ${isFollowingMe && isIFollowingHim ? " bg-evento-gradient " : ""}
        ${!isFollowingMe && !isIFollowingHim ? "bg-eventoPurpleDark hover:bg-eventoPurpleDark/80 " : ""}`}
              onClick={handleFollow}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : isFollowingMe && !isIFollowingHim
                  ? "Follow Back"
                  : isFollowingMe && isIFollowingHim
                    ? "Friends"
                    : !isFollowingMe && isIFollowingHim
                      ? "Unfollow"
                      : "Follow"}
            </Button>
          )}
        </div>
        <div className="w-full">
          {pathname == "/profile" && (
            <ul className="flex  ">
              <li className="w-full">
                <Button
                  variant={"ghost"}
                  className="gap-2 text-xs w-full p-0 "
                  onClick={() => setModalType(ModalType.FOLLOWERS)}
                >
                  <UserRoundPlus className="w-4 h-4" />
                  Followers
                </Button>
              </li>
              <li className="w-full">
                <Button variant={"ghost"} className="text-xs w-full  p-0 ">
                  <Link
                    href={"/profile/edit"}
                    className="flex items-center justify-center gap-2 w-full h-full "
                  >
                    <Pencil className="w-4 h-4" />
                    Edit Profile
                  </Link>
                </Button>
              </li>
              <li className="w-full">
                <Button variant={"ghost"} className="text-xs w-full p-0 ">
                  <Link
                    href={"/profile/settings"}
                    className="flex items-center justify-center gap-2 w-full h-full "
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </Button>
              </li>
            </ul>
          )}
        </div>
      </Section>
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
      {isAuthModalOpen && (
        <AuthModal
          onAuthSuccess={() => {
            setIsAuthModalOpen(false);
          }}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </>
  );
};

export default ProfileHeader;
