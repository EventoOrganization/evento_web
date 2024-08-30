import { cn } from "@/lib/utils";
import { UserType } from "@/types/UserType";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { Button } from "./ui/button";
const UserPrevirew = ({ user }: { user?: UserType }) => {
  // console.log(user);

  return (
    <>
      <span className="flex items-center gap-4">
        {user?.profileImage ? (
          <Image
            src={user.profileImage}
            alt="user image"
            width={500}
            height={500}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="flex flex-col">
            <Avatar className="w-10 h-10 ">
              <AvatarImage
                src="https://github.com/shadcn.png"
                className="rounded-full"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        )}
        {user?.firstName} {user?.lastName}
      </span>
      <Button
        className={cn("bg-gray-200 text-black rounded-full px-5", {
          "bg-evento-gradient-button text-white":
            user?.status === "not-followed",
        })}
      >
        {user?.status === "not-followed" ? "Follow" : "Unfollow"}
      </Button>
    </>
  );
};

export default UserPrevirew;
