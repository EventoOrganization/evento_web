"use client";
import Section from "@/components/layout/Section";
import RenderMedia from "@/components/RenderMedia";
import RequestModal from "@/components/RequestModal";
import Loader from "@/components/ui/Loader";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import TabSelector from "@/features/discover/TabSelector";
import EventAttendeesTab from "@/features/event/components/EventAttendeesTab";
import EventDescriptionTab from "@/features/event/components/EventDescriptionTab";
import EventEdit from "@/features/event/components/EventEdit";
import { useToast } from "@/hooks/use-toast";
import { useGlobalStore } from "@/store/useGlobalStore";
import { EventType } from "@/types/EventType";
import { renderDate } from "@/utils/dateUtils";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { createUpdateEventField } from "@/utils/updateEventHelper";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
export type EventStatusKeys = "isGoing" | "isFavourite" | "isRefused";

const EventPage = () => {
  const { id } = useParams();
  const params = useSearchParams();
  const eventId = Array.isArray(id) ? id[0] : id;
  const { token, user } = useSession();
  const { toast } = useToast();
  const { users } = useGlobalStore((state) => state);
  const [event, setEvent] = useState<EventType | null>(null);
  const [selectedTab, setSelectedTab] = useState("Description");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [hasAccess, setHasAccess] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [isTempGuest, setIsTempGuest] = useState(false);
  const handleUpdateField = (field: string, value: any) => {
    if (event) {
      const updateFunction = createUpdateEventField(event); // Crée la fonction
      const updatedEvent = updateFunction(field, value); // Utilise-la avec deux arguments
      setEvent(updatedEvent);
    }
  };
  const updateEventStatusLocally = (
    statusKey: EventStatusKeys,
    value: boolean,
  ) => {
    setEvent((prevEvent) => {
      if (!prevEvent) return prevEvent;

      const resetStatus = {
        isGoing: false,
        isFavourite: false,
        isRefused: false,
      };

      return {
        ...prevEvent,
        ...resetStatus,
        [statusKey]: value,
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
        const userQuery = user ? `&user=${user._id}` : "";
        const response = await fetchData(
          `/events/getEvent/${eventId}?userId=${user?._id}${userQuery}`,
          HttpMethod.GET,
          null,
          token,
        );
        if (response.ok) {
          setEvent(response.data as EventType);
        } else {
          toast({ description: "Event not found", variant: "destructive" });
        }
      } catch {
        toast({ description: "Error fetching event", variant: "destructive" });
      }
    };
    fetchEventData();
  }, [eventId, token, toast]);

  useEffect(() => {
    if (event?.eventType === "private") {
      setIsPrivate(true);
      console.log("Event is private.");
      if (event?.user?._id === user?._id) {
        setIsAdmin(true);
        console.log("Access granted: user is the admin.");
      } else {
        setIsAdmin(false);
        console.log("Access condition failed: user is not the admin.");
      }

      if (event?.guests?.some((guest) => guest._id === user?._id)) {
        setIsGuest(true);
        console.log("Access granted: user is in the guest list.");
      } else {
        setIsGuest(false);
        console.log("Access condition failed: user is not in the guest list.");
      }

      if (
        event?.tempGuests?.some((guest) => guest.email === params.get("email"))
      ) {
        setIsTempGuest(true);
        console.log("Access granted: user is a temporary guest.");
      } else {
        setIsTempGuest(false);
        console.log("Access condition failed: user is not a temporary guest.");
      }
    } else {
      setIsPrivate(false);
      console.log("Event is public.");
    }
    const accessGranted = !isPrivate || isAdmin || isGuest || isTempGuest;
    setHasAccess(accessGranted);
    console.log("event", event);
  }, [event]);
  if (!event) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="md:grid-cols-2 grid grid-cols-1 w-full h-screen">
      {isAuthModalOpen && (
        <AuthModal onAuthSuccess={() => setIsAuthModalOpen(false)} />
      )}
      <RequestModal
        isOpen={isPrivate && !hasAccess}
        onRequestToJoin={handleRequestToJoin}
        onAuthModalOpen={() => setIsAuthModalOpen(true)}
        hasToken={!!token}
      />
      <div className="md:p-10 md:pl-0 p-4 h-full">
        <div className="flex items-center w-full justify-between mb-4">
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
                  src={"https://github.com/shadcn.png"}
                  className="rounded-full w-10 h-10"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
            <h4 className="ml-2">
              {event?.user?.username.charAt(0).toUpperCase() +
                event?.user?.username.slice(1) || ""}
            </h4>
          </Link>
          <span className="text-sm">{renderDate(event)}</span>
        </div>
        <RenderMedia event={event} />
      </div>
      <Section className="justify-start py-10 w-full h-full">
        <TabSelector
          onChange={setSelectedTab}
          tabs={
            ["Description", "Attendees", isAdmin ? "Settings" : null].filter(
              Boolean,
            ) as string[]
          }
          className="mb-10"
        />
        {selectedTab === "Description" && (
          <EventDescriptionTab
            event={event}
            updateEventStatusLocally={updateEventStatusLocally}
          />
        )}
        {selectedTab === "Attendees" && hasAccess && (
          <EventAttendeesTab event={event} />
        )}
        {selectedTab === "Settings" && (
          <>
            <EventEdit
              event={event}
              allUsers={users}
              onUpdateField={handleUpdateField}
            />
          </>
        )}
      </Section>
    </div>
  );
};

export default EventPage;
