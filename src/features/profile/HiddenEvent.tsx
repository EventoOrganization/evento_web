import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEventStore } from "@/store/useEventsStore";
import { useProfileStore } from "@/store/useProfileStore";
import { EventType } from "@/types/EventType";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import EventPreview from "../event/components/EventPreview";

const HiddenEvent = () => {
  const { userInfo } = useProfileStore();
  const { events } = useEventStore();

  const HiddenEvents = events.filter((event: EventType) => {
    const userId = userInfo?._id?.toString();
    return event.hiddenByUsers?.some((id) => id?.toString?.() === userId);
  });

  if (HiddenEvents.length === 0) return null;
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger>
          <PopoverTrigger asChild>
            <div className="relative cursor-pointer">
              <EyeClosedIcon className="w-6 h-6 text-gray-600" />
              {HiddenEvents.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {HiddenEvents.length}
                </span>
              )}
            </div>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{HiddenEvents.length} events hidding</TooltipContent>
      </Tooltip>
      <PopoverContent
        className="w-fit max-w-2xl p-2 bg-white shadow-lg rounded-md border"
        align="start"
        sideOffset={10}
        side="bottom"
      >
        <p className="text-sm font-semibold mb-2">Hidding Events</p>
        <ul
          className={` grid grid-cols-1 md:grid-cols-${HiddenEvents.length === 1 ? 1 : HiddenEvents.length === 2 ? 2 : HiddenEvents.length > 3 ? 3 : 4} gap-2`}
        >
          {HiddenEvents.map((event) => (
            <li key={event._id} className="max-w-40">
              <EventPreview key={event._id} event={event} title={event.title} />
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default HiddenEvent;
