import { useSession } from "@/contexts/SessionProvider";
import DeleteEventButton from "@/features/event/components/DeleteEventButton";
import { hasEventhost } from "@/features/event/eventActions";
import { handleSwitchHideFromProfile } from "@/features/profile/profileAction";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventsStore";
import { useProfileStore } from "@/store/useProfileStore";
import { EventType } from "@/types/EventType";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Label } from "./ui/label";
import { Switch } from "./ui/togglerbtn";

const EventSettingButton = ({
  className,
  variant = "outline",
  event,
}: {
  className: string;
  variant?:
    | "link"
    | "outline"
    | "default"
    | "destructive"
    | "secondary"
    | "ghost";
  event?: EventType;
}) => {
  const { user, token } = useSession();
  const { updateEvent, events } = useEventStore();
  const { userInfo } = useProfileStore();
  return (
    <>
      <DropdownMenu>
        <Button
          variant={variant}
          className={cn(
            className,
            "w-fit flex justify-center items-center pt-1 hover:opacity-80 opacity-40",
          )}
          asChild
          onClick={(e) => {
            console.log("event", event);
            e.stopPropagation();
          }}
        >
          <DropdownMenuTrigger
            onClick={(e) => {
              console.log("event", event);
              e.stopPropagation();
            }}
            className=""
          >
            ...
          </DropdownMenuTrigger>
        </Button>
        <DropdownMenuContent className="mx-2">
          <DropdownMenuLabel>Event settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user && event && token && (
            <DropdownMenuItem>
              <Label
                htmlFor="hideFromProfile"
                onClick={(e) => e.stopPropagation()}
              >
                Hide from profile
              </Label>
              <Switch
                id="hideFromProfile"
                checked={event?.hiddenByUsers?.some((id) => id === user?._id)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSwitchHideFromProfile(
                    event._id,
                    user._id,
                    token,
                    userInfo,
                    events,
                    updateEvent,
                  );
                }}
              />
            </DropdownMenuItem>
          )}
          {event && user && hasEventhost(event, user) && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <DeleteEventButton
                  eventId={event._id}
                  isHost={true}
                  className="w-full"
                />
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default EventSettingButton;
