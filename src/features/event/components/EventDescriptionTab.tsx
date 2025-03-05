// components/EventDescriptionTab.tsx

import AddressModal from "@/components/AddressModal";
import AddToCalendar from "@/components/AddToCalendar";
import EventoLoader from "@/components/EventoLoader";
import EventoSpinner from "@/components/EventoSpinner";
import {
  default as TruncatedText,
  default as TruncateText,
} from "@/components/TruncatedText";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/contexts/SessionProvider";
import EventActionIcons from "@/features/event/components/EventActionIcons";
import { useToast } from "@/hooks/use-toast";
import { useUsersStore } from "@/store/useUsersStore";
import { EventType } from "@/types/EventType";
import { renderDate } from "@/utils/dateUtils";
import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EventStatusKeys } from "./EventIdTabs";
interface EventDescriptionTabProps {
  event: EventType;
  updateEventStatusLocally?: (
    statusKey: EventStatusKeys,
    value: boolean,
  ) => void;
}

const EventDescriptionTab: React.FC<EventDescriptionTabProps> = ({
  event,
  updateEventStatusLocally,
}) => {
  const { toast } = useToast();
  const { users } = useUsersStore();
  const { user } = useSession();
  const isAdmin =
    user?._id === event.user._id || user
      ? (event.coHosts?.some((coHost) => coHost.userId?._id === user._id) ??
        false)
      : false;
  const filteredAnnouncements =
    event.announcements &&
    event.announcements.filter((announcement) => {
      if (isAdmin) return true;
      if (!user) return false;

      const isDirectRecipient = announcement.receivers.userIds?.includes(
        user._id,
      );
      const hasMatchingStatus =
        announcement.receivers.status &&
        ((announcement.receivers.status === "going" && event.isGoing) ||
          (announcement.receivers.status === "invited" && event.isFavourite) ||
          (announcement.receivers.status === "decline" && event.isRefused));

      return isDirectRecipient || hasMatchingStatus;
    });
  return (
    <div className="flex flex-col h-full gap-2 w-full">
      <h2 className="text-xl font-bold">{event?.title}</h2>
      <div className="flex justify-between items-center text-sm">
        <AddressModal address={event?.details?.location} />
      </div>
      <div className="flex flex-wrap text-sm justify-between text-muted-foreground">
        <p className="whitespace-nowrap text-black font-bold">
          {renderDate(event) || <EventoLoader />}
        </p>
        <p className="whitespace-nowrap">
          {event?.details?.startTime}
          {event?.details?.endTime ? ` - ${event?.details?.endTime}` : ""}
        </p>
      </div>
      <EventActionIcons
        event={event}
        updateEventStatusLocally={updateEventStatusLocally}
        isLocal
      />
      <TruncatedText
        expand={
          event.announcements && event.announcements?.length > 0 ? false : true
        }
        className="px-0 text-muted-foreground"
        text={event?.details?.description || ""}
      />
      {filteredAnnouncements && filteredAnnouncements.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-eventoPink text-base">New Update</h3>
          {filteredAnnouncements.map((announcement) => {
            const sender =
              user && user._id === announcement.senderId
                ? user
                : users.find((u) => u._id === announcement.senderId);

            return (
              <div
                key={announcement._id}
                className="bg-muted border-none shadow-none p-2 rounded-lg"
              >
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    {sender ? (
                      <Image
                        src={sender.profileImage || "/evento-logo.png"}
                        alt={sender.username || "User"}
                        width={30}
                        height={30}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <Avatar>
                        <AvatarImage
                          src={"/evento-logo.png"}
                          className="rounded-full w-6 h-6"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    )}
                    <p className="font-bold">
                      {sender?.username || "Unknown User"}
                    </p>
                  </div>
                  <Button
                    variant={"ghost"}
                    onClick={() => {
                      toast({
                        title: "In progress",
                        description:
                          "This button will delete the announcement in the future, only admin can see this button",
                        variant: "evento",
                      });
                    }}
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    <span className="hidden md:flex">Delete</span>
                  </Button>
                </div>
                <TruncatedText
                  expand
                  className="mt-2 text-sm text-muted-foreground pl-8 "
                  text={announcement.message}
                />

                <Accordion type="single" collapsible className="p-0">
                  <AccordionItem value="comments">
                    <AccordionTrigger
                      className="text-sm text-eventoPink justify-end p-0"
                      onClick={() => {
                        toast({
                          title: "In progress",
                          description: `This button will show comments in the future`,
                          variant: "evento",
                        });
                      }}
                    >
                      {announcement.comments.length} comments
                    </AccordionTrigger>
                    {announcement.comments.length > 0 && (
                      <AccordionContent>
                        {announcement.comments.map((comment) => (
                          <>
                            {comment.userId ? (
                              <Image
                                src={
                                  users.find((u) => u._id === comment.userId)
                                    ?.profileImage || "/evento-logo.png"
                                }
                                alt={
                                  users.find((u) => u._id === comment.userId)
                                    ?.username || "User"
                                }
                                width={30}
                                height={30}
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <Avatar>
                                <AvatarImage
                                  src={"/evento-logo.png"}
                                  className="rounded-full w-8 h-8"
                                />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                            )}
                            <p>{comment.content}</p>
                          </>
                        ))}
                      </AccordionContent>
                    )}
                  </AccordionItem>
                </Accordion>
                <div className="flex items-center gap-2 py-2 pl-8">
                  {user ? (
                    <Image
                      src={user.profileImage || "/evento-logo.png"}
                      alt={user.username || "User"}
                      width={30}
                      height={30}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <Avatar>
                      <AvatarImage
                        src={"/evento-logo.png"}
                        className="rounded-full w-6 h-6"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  )}
                  <Input type="text" placeholder="Add a comment" disabled />
                  <Button
                    variant={"eventoPrimary"}
                    onClick={() => {
                      toast({
                        title: "In progress",
                        description:
                          "This button will add a comment in the future",
                        variant: "evento",
                      });
                    }}
                  >
                    <EventoSpinner />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ul className="flex flex-wrap gap-2">
        {event.interests &&
          event.interests?.map((interest) => {
            return (
              <li
                key={interest._id || interest.name}
                className="bg-eventoPurpleLight/30 w-fit px-2 py-1 rounded-lg text-sm"
              >
                {interest.name}
              </li>
            );
          })}
      </ul>
      <Link
        href={event?.details?.URLlink || ""}
        target="_blank"
        className="underline text-blue-500"
      >
        <TruncateText
          text={event?.details?.URLtitle || event?.details?.URLlink || ""}
        />
      </Link>
      <AddToCalendar event={event} />
    </div>
  );
};

export default EventDescriptionTab;
