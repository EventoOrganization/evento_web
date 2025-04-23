import { Switch } from "@/components/ui/togglerbtn";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { toast } from "@/hooks/use-toast";
import { useCreateEventStore } from "@/store/useCreateEventStore";
import { EventType } from "@/types/EventType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { handleFieldChange } from "../eventActions";
interface RestrictedToggleProps {
  event?: EventType;
}
const RestrictedToggle = ({ event }: RestrictedToggleProps) => {
  const { isRestricted: isRestrictedEvent } = useCreateEventStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isRestricted, setIsRestricted] = useState(
    event ? event.restricted : isRestrictedEvent,
  );
  const { token } = useSession();
  useEffect(() => {
    console.log("Component isRestricted state", isRestricted);
    if (event) {
      console.log("Database isRestricted state", event?.restricted);
    } else {
      console.log("Store isRestricted state", isRestrictedEvent);
    }
  }, [isRestricted]);
  const handleRestricted = async () => {
    if (event) {
      const eventId = event._id;
      try {
        const response = await fetchData(
          `/events/updateEvent/${eventId}`,
          HttpMethod.PUT,
          { field: "restricted", value: !isRestricted },
          token,
        );
        if (response.ok) {
          setIsRestricted(!isRestricted);
          toast({
            description: `Event ${isRestricted ? "unrestricted" : "restricted"} successfully!`,
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
    } else {
      setIsRestricted(!isRestricted);
      handleFieldChange("isRestricted", !isRestricted);
    }
  };
  return (
    <div className="flex gap-2 items-center">
      <InfoIcon
        className="w-4 text-gray-500 cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      />
      {showTooltip && (
        <span className="absolute bg-gray-800 text-white text-xs rounded py-1 px-2 -mt-10 ml-4 z-10">
          When <b>Restricted</b> is enabled, users accessing the event through
          the link will need to send a request to the host to join, unless they
          are explicitly invited.
        </span>
      )}
      <p className="text-sm text-muted-foreground">Restricted</p>
      <Switch checked={isRestricted} onCheckedChange={handleRestricted} />
    </div>
  );
};

export default RestrictedToggle;
