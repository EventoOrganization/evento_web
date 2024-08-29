import { UserType } from "@/types/UserType";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { Button } from "./ui/button";
const UserPrevirew = ({ user }: { user?: UserType }) => {
  return (
    <>
      <span className="flex items-center gap-4">
        {user?.profileImage ? (
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
        {user?.firstName} {user?.lastName}
      </span>
      <Button className={"bg-gray-200 text-black rounded-full px-5"}>
        Following
      </Button>
    </>
  );
};

export default UserPrevirew;
