import EventoSpinner from "@/components/EventoSpinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/contexts/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { EventType } from "@/types/EventType";
import { TempUserType, UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { BellIcon, XIcon } from "lucide-react";
import { useState } from "react";

type AddAnnouncementProps = {
  event: EventType | undefined;
  invitedUsers: (UserType | TempUserType)[];
  setIsSelectEnable: (isEnabled: boolean) => void;
  setEvent?: (event: EventType) => void;
  selectedIds?: string[];
};

const AddAnnouncement = ({
  event,
  invitedUsers,
  setIsSelectEnable,
  selectedIds,
  setEvent,
}: AddAnnouncementProps) => {
  const { toast } = useToast();
  const { token, user } = useSession();
  const [isNotifying, setIsNotifying] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getPlaceholder = (value: string) => {
    switch (value) {
      case "going":
        return "Notify all attendees who are going now!";
      case "invited":
        return "Notify all invited guests now!";
      case "decline":
        return "Notify all declined guests now!";
      case "individuals":
        return "Select people from the lists above to notify them.";
      default:
        return "";
    }
  };

  const handleAnnouncement = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Message cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const receivers =
        isNotifying === "individuals"
          ? { userIds: selectedIds || [] }
          : { status: isNotifying };

      const response = await fetchData<any>(
        `/events/${event?._id}/createAnnouncement`,
        HttpMethod.POST,
        {
          userId: user?._id,
          message,
          receivers,
        },
        token,
      );

      if (!response.ok) {
        throw new Error("Failed to send announcement");
      }

      toast({
        title: "Success",
        description: "Announcement sent successfully!",
        className: "bg-evento-gradient text-white",
      });

      // Reset state
      setIsNotifying("");
      setMessage("");
      setIsSelectEnable(false);
      console.log("response", response?.data?.announcement);
      if (event && setEvent) {
        setEvent({
          ...event,
          announcements: [
            ...(event.announcements ?? []),
            response.data.announcement,
          ],
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Label htmlFor="notify" className="text-eventoPurpleLight">
        <BellIcon className="inline h-4 w-4 " /> Notify Guests
      </Label>
      <Select
        disabled={isLoading}
        value={isNotifying}
        onValueChange={(value) => {
          setIsNotifying(value);
          setIsSelectEnable(value === "individuals");
        }}
      >
        <SelectTrigger id="notify">
          <SelectValue placeholder="Select who is notified" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="going">
            Going ({event?.attendees?.length})
          </SelectItem>
          <SelectItem value="invited">
            Invited ({invitedUsers?.length})
          </SelectItem>
          {event?.eventType === "private" && (
            <SelectItem value="decline">
              Decline ({event?.refused?.length})
            </SelectItem>
          )}
          <SelectItem value="individuals">
            Select Individuals ({selectedIds?.length})
          </SelectItem>
        </SelectContent>
      </Select>
      {isNotifying && (
        <div className="col-span-2 flex flex-col gap-2">
          <Textarea
            placeholder={getPlaceholder(isNotifying)}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
          />
          <div className="flex w-fit gap-2 self-end">
            <Button
              disabled={isLoading}
              onClick={() => {
                setIsNotifying("");
                setMessage("");
                setIsSelectEnable(false);
              }}
              variant={"eventoSecondary"}
            >
              <XIcon size={16} />
              Cancel
            </Button>
            <Button
              variant={"eventoPrimary"}
              onClick={handleAnnouncement}
              disabled={isLoading}
            >
              {isLoading ? <EventoSpinner /> : "Send Announcement"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddAnnouncement;
