import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserType } from "@/types/UserType";
import { useState } from "react";
import SmartImage from "./SmartImage";

const Dropdown = ({ title, users }: { title: string; users: UserType[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {title} ({users.length}) {isOpen ? "▲" : "▼"}
      </button>
      {isOpen && (
        <ul className="absolute w-full bg-white shadow-md mt-2 max-h-60 overflow-auto">
          {users.map((user) => (
            <li
              key={user._id}
              className="flex items-center px-4 py-2 hover:bg-gray-100"
            >
              {user.profileImage ? (
                <SmartImage
                  src={user.profileImage}
                  width={30}
                  height={30}
                  alt={user.username}
                  className="w-10 h-10 rounded-full mr-3"
                  forceImg
                />
              ) : (
                <Avatar>
                  <AvatarImage
                    src={"/evento-logo.png"}
                    className="rounded-full w-8 h-8 "
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              )}
              <span className="flex-1">{user.username}</span>
              <button className="text-blue-500 hover:text-blue-700">
                Follow
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
