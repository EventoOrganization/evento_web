"use client";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { EventType } from "@/types/EventType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useState } from "react";
import { Label } from "./ui/label";
import { Switch } from "./ui/togglerbtn";

type Props = {
  event?: EventType | undefined;
};

const GuestAllowFriendToggle = ({ event }: Props) => {
  const { token } = useSession();
  const { toast } = useToast();
  const [isGuestAllowed, setIsGuestAllowed] = useState<boolean>(
    event?.guestsAllowFriend || false,
  );
  const eventId = event?._id;
  const handleToggle = async () => {
    try {
      const newStatus = !isGuestAllowed;
      const response = await fetchData(
        `/events/${eventId}/updateGuestsAllowFriend`,
        HttpMethod.PUT,
        { guestsAllowFriend: newStatus },
        token,
      );

      if (response.ok) {
        setIsGuestAllowed(newStatus);
        toast({
          description: `Guests ${newStatus ? "allowed" : "denied"} successfully!`,
          className: "bg-evento-gradient text-white",
          duration: 3000,
        });
      } else {
        console.error("Error updating guestsAllowFriend:", response.error);
        toast({
          description: "Error updating guestsAllowFriend",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating guestsAllowFriend:", error);
      toast({
        description: "Error updating guestsAllowFriend",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="guestsAllowFriend"
        checked={isGuestAllowed}
        onCheckedChange={handleToggle}
      />
      <Label htmlFor="guestsAllowFriend" className="cursor-pointer">
        Allow guests to bring friends
      </Label>
    </div>
  );
};

export default GuestAllowFriendToggle;
