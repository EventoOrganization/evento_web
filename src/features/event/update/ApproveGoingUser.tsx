import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { useEventStore } from "@/store/useEventsStore";
import { EventType } from "@/types/EventType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
interface ApproveGoingUserProps {
  event: EventType;
  userId: string;
  setEvent?: (event: EventType) => void;
}
const ApproveGoingUser = ({
  event,
  userId,
  setEvent,
}: ApproveGoingUserProps) => {
  const { token } = useSession();
  const { toast } = useToast();
  const { updateEvent } = useEventStore();
  const handleApproveGoingUser = async () => {
    if (!event || !userId || !setEvent) return;
    try {
      const response = await fetchData(
        `/events/updateEvent/${event._id}`,
        HttpMethod.PUT,
        { field: "approvedUserIds", value: userId },
        token,
      );
      if (!response.ok) {
        throw new Error("Failed to approve user.");
      }
      updateEvent(event._id, {
        approvedUserIds: [...(event?.approvedUserIds || []), userId],
      });
      setEvent({
        ...event,
        approvedUserIds: [...(event?.approvedUserIds || []), userId],
      });
      toast({
        title: "Success",
        description: "User has been approved.",
        duration: 2000,
        variant: "evento",
      });
    } catch (error) {
      toast({
        description: "Error approving user.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  return (
    <Button variant={"eventoPrimary"} onClick={handleApproveGoingUser}>
      Approve
    </Button>
  );
};

export default ApproveGoingUser;
