"use client";
import EventoLoader from "@/components/EventoLoader";
import Section from "@/components/layout/Section";
import RenderMedia from "@/components/RenderMedia";
import RequestModal from "@/components/RequestModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import TabSelector from "@/features/discover/TabSelector";
import EventAttendeesTab from "@/features/event/components/EventAttendeesTab";
import EventDescriptionTab from "@/features/event/components/EventDescriptionTab";
import EventEdit from "@/features/event/components/EventEdit";
import StructuredData from "@/features/SEO/StructuredEventData";
import { useToast } from "@/hooks/use-toast";
import { useUsersStore } from "@/store/useUsersStore";
import { EventType } from "@/types/EventType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { createUpdateEventField } from "@/utils/updateEventHelper";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DeleteEventButton from "./DeleteEventButton";
import PastEventGallery from "./PastEventGallery";
export type EventStatusKeys = "isGoing" | "isFavourite" | "isRefused";

const EventIdTabs = ({ evento }: { evento?: EventType }) => {
  const { id } = useParams();
  const params = useSearchParams();
  const eventId = Array.isArray(id) ? id[0] : id;
  const { token, user } = useSession();
  const { toast } = useToast();
  const { users } = useUsersStore();
  const [event, setEvent] = useState<EventType | null>(evento || null);
  const [selectedTab, setSelectedTab] = useState("Description");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessControl, setAccessControl] = useState({
    isPublic: false,
    isPrivate: false,
    isRestricted: false,
    isCoHost: false,
    isAdmin: false,
    isGuest: false,
    isTempGuest: false,
    hasAccess: true,
  });
  const handleUpdateField = (field: string, value: any) => {
    if (event) {
      const updateFunction = createUpdateEventField(event);
      const updatedEvent = updateFunction(field, value);
      setEvent(updatedEvent);
    }
  };

  const updateEventStatusLocally = (
    statusKey: EventStatusKeys,
    value: boolean,
  ) => {
    setEvent((prevEvent) => {
      if (!prevEvent || !user) return prevEvent;

      const resetStatus = {
        isGoing: false,
        isFavourite: false,
        isRefused: false,
      };

      // Nouveaux tableaux
      const updatedAttendees =
        statusKey === "isGoing" && value
          ? [...(prevEvent.attendees || []), user]
          : (prevEvent.attendees || []).filter((u) => u._id !== user._id);

      const updatedFavouritees =
        statusKey === "isFavourite" && value
          ? [...(prevEvent.favouritees || []), user]
          : (prevEvent.favouritees || []).filter((u) => u._id !== user._id);

      const updatedRefused =
        statusKey === "isRefused" && value
          ? [...(prevEvent.refused || []), user]
          : (prevEvent.refused || []).filter((u) => u._id !== user._id);

      return {
        ...prevEvent,
        ...resetStatus,
        [statusKey]: value,
        attendees: updatedAttendees,
        favouritees: updatedFavouritees,
        refused: updatedRefused,
      };
    });
  };

  const handleRequestToJoin = async () => {
    try {
      const response = await fetchData(
        `/events/${eventId}/requestToJoin`,
        HttpMethod.POST,
        { userId: user?._id },
        token,
      );
      if (response.ok) {
        toast({
          description: "Your request to join has been sent!",
          className: "bg-evento-gradient text-white",
          duration: 3000,
        });
      } else {
        toast({
          description: response.error,
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        description: "Error sending join request.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const userQuery = user ? `?userId=${user._id}` : "";
        const response = await fetchData(
          `/events/getEvent/${eventId}${userQuery}`,
          HttpMethod.GET,
          null,
          token,
        );
        setEvent(response.data as EventType);
        console.log("event", response.data);
      } catch {
        toast({ description: "Error fetching event", variant: "destructive" });
      }
    };
    fetchEventData();
  }, [eventId, token, toast]);

  useEffect(() => {
    const emailParam = params.get("email");
    console.log("emailParam", emailParam);
    setIsLoading(true);

    if (event) {
      const isPublic = event.eventType === "public";
      const isPrivate = event.eventType === "private";
      const isRestricted = event.restricted || false;
      const isAdmin = user?._id === event.user?._id;
      const isGuest = user
        ? event.guests?.some((guest) => guest._id === user._id) || false
        : false;
      const isUnconnectedGuest =
        event.guests?.some((guest) => guest.email === emailParam) || false;
      const isAttendee =
        event.attendees?.some((attendee) => attendee._id === user?._id) ||
        false;
      const isCoHost = user
        ? (event.coHosts?.some((coHost) => coHost.userId?._id === user._id) ??
          false)
        : false;
      const isUnconnectedCoHost =
        event.coHosts?.some((coHost) => coHost.email === emailParam) || false;
      const isTempGuest =
        event.tempGuests?.some((guest) => guest.email === emailParam) || false;

      const accessStates = {
        isPublic,
        isPrivate,
        isRestricted,
        isAdmin,
        isCoHost,
        isGuest,
        isTempGuest,
        isAttendee,
        isUnconnectedGuest,
        isUnconnectedCoHost,
        hasAccess: null,
      };
      console.log("Access states:", accessStates);

      const hasAccess =
        isPublic ||
        isAdmin ||
        isGuest ||
        isCoHost ||
        isTempGuest ||
        isAttendee ||
        isUnconnectedGuest ||
        isUnconnectedCoHost ||
        (!isRestricted && isPrivate);

      const updatedAccessStates = { ...accessStates, hasAccess };
      setAccessControl(updatedAccessStates);
    } else {
      setAccessControl((prev) => ({
        ...prev,
        hasAccess: false,
      }));
    }

    setIsLoading(false);
  }, [event, user, params]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <EventoLoader />
      </div>
    );
  }
  return (
    <>
      {!accessControl.hasAccess && (
        <RequestModal
          isOpen={accessControl.isRestricted}
          onRequestToJoin={handleRequestToJoin}
          onAuthModalOpen={() => setIsAuthModalOpen(true)}
          hasToken={!!token}
        />
      )}
      {event && (
        <>
          <StructuredData event={event} />
          <div className="md:grid-cols-2 grid grid-cols-1 w-full max-w-7xl mx-auto">
            {isAuthModalOpen && (
              <AuthModal onAuthSuccess={() => setIsAuthModalOpen(false)} />
            )}
            <div className="md:p-10 md:pl-0 h-full ">
              <div className="flex items-center w-full justify-between p-4">
                <Link
                  className="flex items-center gap-2"
                  href={`/profile/${event?.user?._id}`}
                >
                  {event?.user?.profileImage ? (
                    <Image
                      src={event?.user.profileImage}
                      alt="user image"
                      width={30}
                      height={30}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <Avatar>
                      <AvatarImage
                        src={"/icon-384x384.png"}
                        className="rounded-full w-10 h-10"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-wrap overflow-hidden">
                    <h4 className="truncate text-sm md:text-base">
                      {(event &&
                        event?.user.username.charAt(0).toUpperCase() +
                          event?.user.username.slice(1)) ||
                        ""}
                    </h4>
                    {event.coHosts?.length === 1 &&
                      event.coHosts.map((coHost: any) => (
                        <h4
                          className="truncate text-sm md:ml-1 md:text-base"
                          key={coHost._id}
                        >
                          &{" "}
                          {coHost?.userId?.username &&
                            coHost?.userId?.username.charAt(0).toUpperCase() +
                              coHost?.userId?.username.slice(1)}
                        </h4>
                      ))}
                    {event.coHosts && event.coHosts.length > 1 && (
                      <h4 className="truncate text-sm md:text-base md:ml-1">
                        & {event.coHosts?.length} more
                      </h4>
                    )}
                  </div>
                </Link>
                {accessControl.isAdmin && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Pencil
                          className="text-muted-foreground"
                          onClick={() => setSelectedTab("Settings")}
                        />
                      </TooltipTrigger>
                      <TooltipContent>Edit Event</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {/* <span className="text-sm">{renderDate(event)}</span> */}
              </div>
              {selectedTab !== "Settings" && <RenderMedia event={event} />}
            </div>
            <Section className="justify-start gap-2 pt-2 md:pt-14 w-full h-full px-2">
              <div className=" sticky top-0 w-full z-10">
                <TabSelector
                  onChange={setSelectedTab}
                  tabs={
                    ["Description", "Attendees", "Gallery"].filter(
                      Boolean,
                    ) as string[]
                  }
                />
              </div>
              {selectedTab === "Description" && (
                <EventDescriptionTab
                  event={event}
                  updateEventStatusLocally={updateEventStatusLocally}
                />
              )}

              {selectedTab === "Attendees" && accessControl.hasAccess && (
                <EventAttendeesTab
                  event={event}
                  isAdmin={accessControl.isAdmin}
                  isPrivate={accessControl.isPrivate}
                  setEvent={setEvent}
                />
              )}
              {selectedTab === "Gallery" && <PastEventGallery event={event} />}
              {selectedTab === "Settings" && (
                <>
                  <EventEdit
                    event={event}
                    allUsers={users}
                    onUpdateField={handleUpdateField}
                  />
                  <DeleteEventButton
                    eventId={event._id}
                    isHost={accessControl.isAdmin}
                  />
                </>
              )}
            </Section>
          </div>
        </>
      )}
    </>
  );
};

export default EventIdTabs;
