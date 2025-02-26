"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/togglerbtn";
import { useSession } from "@/contexts/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { EventType } from "@/types/EventType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useState } from "react";

type Props = {
  event?: EventType | undefined;
};

const HideGuestList = ({ event }: Props) => {
  const { token } = useSession();
  const { toast } = useToast();
  const [isGuestAllowed, setIsGuestAllowed] = useState<boolean>(
    event?.guestsAllowFriend || false,
  );
  const eventId = event?._id;
  const handleToggle = async () => {
    toast({
      title: "Coming Soon",
      description:
        "This feature will allow hiding the guest list from regular users while keeping it visible to the host and co-host.",
      variant: "evento",
    });

    return;
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
        Hide guestlist
      </Label>
    </div>
  );
};

export default HideGuestList;
