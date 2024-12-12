import InstagramIcon from "@/components/icons/InstagramIcon";
import LinkedinIcon from "@/components/icons/LinkedinIcon";
import TiktokIcon from "@/components/icons/TiktokIcon";
import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import UserListModal from "@/components/UserListModal";
import { InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { Pencil, Settings, UserRoundPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
interface Props {
  profile: UserType | null | undefined;
}
enum ModalType {
  FOLLOWERS = "followers",
  FOLLOWING = "following",
}
const platformIcons: Record<string, JSX.Element> = {
  linkedin: <LinkedinIcon />,
  tiktok: <TiktokIcon />,
  instagram: <InstagramIcon />,
};
const ProfileHeader = ({ profile }: Props) => {
  const pathname = usePathname();
  const [modalType, setModalType] = useState<ModalType | "">("");
  const interests: InterestType[] = profile?.interests || [];
  const socialLinks = profile?.socialLinks || [];
  console.log("INTERESTS", socialLinks);
  return (
    <>
      <Section className="text-sm gap-2 border-b-2 py-6 max-w-2xl">
        <div className="flex justify-between w-full items-center">
          <figure>
            <Image
              src={profile?.profileImage || "/icon-384x384.png"}
              alt="user profile image"
              width={500}
              height={500}
              className="w-24 h-24 md:w-36 md:h-36 object-cover rounded-full"
              priority
            />
          </figure>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 md:px-4">
              <span className="font-bold text-base">
                {profile && profile.totalEventAttended !== undefined
                  ? profile.totalEventAttended
                  : 0}
              </span>
              <p>Event Attended</p>
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
        <div className="flex flex-col w-full mt-2 gap-2">
          <h3>{profile?.username}</h3>
          <p className="text-xs text-muted-foreground">{profile?.address}</p>
        </div>
        {interests && interests.length > 0 && (
          <div className="flex flex-wrap gap-2 w-full">
            {interests.map((interest) => (
              <span
                key={interest._id}
                className={`px-2 py-1 rounded-md border text-xs w-fit flex items-center justify-center bg-muted text-black`}
              >
                {interest.name}
              </span>
            ))}
          </div>
        )}
        {socialLinks && socialLinks?.length > 0 && (
          <div className="flex flex-col items-start w-full">
            {socialLinks?.length > 0 && (
              <ul className="flex ">
                {socialLinks.map((link, index) => (
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
    </>
  );
};

export default ProfileHeader;
