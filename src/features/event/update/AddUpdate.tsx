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
import { EventType } from "@/types/EventType";
import { TempUserType, UserType } from "@/types/UserType";
import { BellIcon, XIcon } from "lucide-react";
import { useState } from "react";
type AddUpdateProps = {
  onSave?: () => void;
  event: EventType | undefined;
  setEvent?: (event: EventType) => void;
  invitedUsers: (UserType | TempUserType)[];
  setIsSelectEnable: (isEnabled: boolean) => void;
  selectedIds?: string[];
};
const AddUpdate = ({
  event,
  invitedUsers,
  setIsSelectEnable,
  selectedIds,
}: AddUpdateProps) => {
  const [isNotifying, setIsNotifying] = useState("");
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
    }
  };
  const handleNotify = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
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
        <SelectTrigger className="" id="notify">
          <SelectValue placeholder="Select who are notified" />
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
            disabled={isLoading}
          />
          <div className="flex w-fit gap-2 self-end">
            <Button
              disabled={isLoading}
              onClick={() => {
                setIsNotifying("");
                setIsSelectEnable(false);
              }}
              variant={"eventoSecondary"}
            >
              <XIcon size={16} />
              Cancel
            </Button>
            <Button
              variant={"eventoPrimary"}
              onClick={handleNotify}
              disabled={isLoading}
            >
              {/* {isLoading ? <EventoSpinner /> : <Send size={16} />}
              Send Message */}
              <EventoSpinner /> Feature in progress
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddUpdate;
