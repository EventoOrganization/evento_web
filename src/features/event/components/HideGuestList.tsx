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
  const [isHideGuestlist, setIsHideGuestlist] = useState<boolean>(
    event?.showUsersLists || false,
  );
  const eventId = event?._id;
  const handleToggle = async () => {
    try {
      const response = await fetchData(
        `/events/updateEvent/${eventId}`,
        HttpMethod.PUT,
        { field: "showUsersLists", value: !isHideGuestlist },
        token,
      );
      if (response.ok) {
        setIsHideGuestlist(!isHideGuestlist);
        toast({
          description: `Guestlist ${!isHideGuestlist ? "is Hidden" : "is Visible"}!`,
          className: "bg-evento-gradient text-white",
          duration: 3000,
        });
      }
      if (response.error) {
        console.error("Error updating event:", response.error);
        toast({
          description: response.error,
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        description: "Error updating event",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  return (
    <div className="flex items-center gap-2">
      <Switch
        id="hideGuestlist"
        checked={isHideGuestlist}
        onCheckedChange={handleToggle}
      />
      <Label htmlFor="hideGuestlist" className="cursor-pointer">
        {isHideGuestlist ? "🔒 Guestlist is Hidden" : "👀 Guestlist is Visible"}
      </Label>
    </div>
  );
};

export default HideGuestList;
