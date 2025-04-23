import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/togglerbtn";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { handleFieldChange } from "@/features/event/eventActions";
import { useToast } from "@/hooks/use-toast";
import { useEventStore } from "@/store/useEventsStore";
import { EventType } from "@/types/EventType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { usePathname } from "next/navigation";
import { useState } from "react";
interface RequiresApprovalToggleProps {
  event?: EventType;
}
const RequiresApprovalToggle = ({ event }: RequiresApprovalToggleProps) => {
  const pathname = usePathname();
  const { toast } = useToast();
  const { token } = useSession();
  const { updateEvent } = useEventStore();
  const isCreatingEvent = pathname.startsWith("/create-event");
  const [isApprovalRequired, setIsApprovalRequired] = useState(
    event?.requiresApproval || false,
  );
  const handleApprovalChange = async (value: boolean) => {
    setIsApprovalRequired(value);
    if (isCreatingEvent) {
      handleFieldChange("requiresApproval", value);
    } else {
      if (!event) return;
      try {
        await fetchData(
          `/events/updateEvent/${event._id}`,
          HttpMethod.PUT,
          { field: "requiresApproval", value },
          token,
        );
        toast({
          description: "Event updated successfully!",
          variant: "evento",
          duration: 3000,
        });
        updateEvent(event._id, { requiresApproval: value });
      } catch (error) {
        console.error("Error updating event:", error);
        toast({
          description: "Error updating event",
          variant: "destructive",
          duration: 3000,
        });
      } finally {
      }
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Switch
          checked={isApprovalRequired}
          onCheckedChange={handleApprovalChange}
          className="mt-1"
        />
        <Label>Approval is required</Label>
      </div>
    </div>
  );
};
export default RequiresApprovalToggle;
