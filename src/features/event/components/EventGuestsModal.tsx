import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { API } from "@/constants";
import apiService from "@/lib/apiService";
import { useEventStore } from "@/store/useEventStore";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  lastName?: string;
  firstName?: string;
}

const EventGuestsModal = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [guests, setGuests] = useState<User[]>([]);
  const eventStore = useEventStore();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiService.get<any>(API.followStatusForAllUsers);
        console.log("Users:", response);
        const sortedUsers = response.body.sort((a: any, b: any) => {
          if (
            a.status === "follow-each-other" &&
            b.status !== "follow-each-other"
          ) {
            return -1;
          }
          if (
            a.status !== "follow-each-other" &&
            b.status === "follow-each-other"
          ) {
            return 1;
          }
          return 0;
        });
        const extractedUsers = sortedUsers.map((item: any) => item.user);

        console.log("Sorted Users:", extractedUsers);

        setUsers(extractedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const addGuest = (user: User) => {
    console.log("guests:", guests);

    setGuests([...guests, user]);
    setUsers(users.filter((u) => u._id !== user._id));
  };

  const removeGuest = (user: User) => {
    setUsers([...users, user]);
    setGuests(guests.filter((g) => g._id !== user._id));
  };

  const handleSave = () => {
    eventStore.setEventField(
      "guests",
      guests.map((guest) => guest._id),
    );
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Guests</Button>
      </DialogTrigger>
      <DialogContent className=" bg-evento-gradient text-white w-[95%] rounded-lg border-none">
        <DialogHeader>
          <DialogTitle>Select Guests</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col-reverse justify-between gap-4 ">
          <div className="">
            <h3 className="mb-2">
              All Users {"( "} {users.length}
              {" )"}
            </h3>
            <ScrollArea className="h-48 border rounded">
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="p-2 flex items-center cursor-pointer hover:bg-muted/20 space-x-4"
                    onClick={() => addGuest(user)}
                  >
                    {user.profileImage &&
                    user.profileImage.startsWith(
                      "https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com",
                    ) ? (
                      <Image
                        src={user.profileImage}
                        alt="user image"
                        width={50}
                        height={50}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <Avatar className="w-12 h-12 rounded-full">
                        <AvatarImage
                          className="w-12 h-12 rounded-full"
                          src="https://github.com/shadcn.png"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm md:text-base">
                        {user.name}
                      </span>
                      <span className="text-xs text-white">
                        {user.lastName} {user.firstName}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-2 text-muted">No users available</div>
              )}
            </ScrollArea>
          </div>
          <div className="">
            <h3 className="mb-2">
              Guests {"( "}
              {guests.length}
              {" )"}
            </h3>
            <ScrollArea className="h-48 border rounded">
              {guests.map((guest) => (
                <div
                  key={guest._id}
                  className="p-2 flex items-center cursor-pointer hover:bg-muted/20 space-x-4"
                  onClick={() => removeGuest(guest)}
                >
                  {guest.profileImage &&
                  guest.profileImage.startsWith(
                    "https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com",
                  ) ? (
                    <Image
                      src={guest.profileImage}
                      alt="guest image"
                      width={50}
                      height={50}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <Avatar className="w-12 h-12 rounded-full">
                      <AvatarImage
                        className="w-12 h-12 rounded-full"
                        src="https://github.com/shadcn.png"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm md:text-base">
                      {guest.name}
                    </span>
                    <span className="text-xs text-white">
                      {guest.lastName} {guest.firstName}
                    </span>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            className="bg-evento-gradient-button border shadow"
            onClick={handleSave}
          >
            Save Guests
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventGuestsModal;
