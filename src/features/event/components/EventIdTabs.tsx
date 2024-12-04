"use client";
import EventoLoader from "@/components/EventoLoader";
import Section from "@/components/layout/Section";
import RenderMedia from "@/components/RenderMedia";
import RequestModal from "@/components/RequestModal";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import TabSelector from "@/features/discover/TabSelector";
import EventAttendeesTab from "@/features/event/components/EventAttendeesTab";
import EventDescriptionTab from "@/features/event/components/EventDescriptionTab";
import EventEdit from "@/features/event/components/EventEdit";
import StructuredData from "@/features/SEO/StructuredEventData";
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
import DeleteEventButton from "./DeleteEventButton";
export type EventStatusKeys = "isGoing" | "isFavourite" | "isRefused";

const EventIdTabs = ({ evento }: { evento?: EventType }) => {
  const { id } = useParams();
  const params = useSearchParams();
  const eventId = Array.isArray(id) ? id[0] : id;
  const { token, user } = useSession();
  const { toast } = useToast();
  const { users } = useGlobalStore((state) => state);
  const [event, setEvent] = useState<EventType | null>(evento || null);
  const [selectedTab, setSelectedTab] = useState("Description");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Access control state
  const [accessControl, setAccessControl] = useState({
    isPublic: false,
    isPrivate: false,
    isRestricted: false,
    isAdmin: false,
    isGuest: false,
    isTempGuest: false,
    hasAccess: true,
  });
  // Fonction pour mettre à jour le champ de l'événement
  const handleUpdateField = (field: string, value: any) => {
    if (event) {
      const updateFunction = createUpdateEventField(event);
      const updatedEvent = updateFunction(field, value);
      console.log("Updated event finally:", updatedEvent);
      setEvent(updatedEvent);
    }
  };

  // Mettre à jour le statut local de l'événement
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

  // Gérer la demande de rejoindre
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

  // Charger les données de l'événement
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

  // Calculer les droits d'accès
  useEffect(() => {
    setIsLoading(true);

    if (event) {
      const isPublic = event.eventType === "public";
      const isPrivate = event.eventType === "private";
      const isRestricted = event.restricted || false;

      const isAdmin = user?._id === event.user?._id;
      const isGuest = user
        ? event.guests?.some((guest) => guest._id === user._id) || false
        : false;
      const isTempGuest = user
        ? event.tempGuests?.some(
            (guest) => guest.email === params.get("email"),
          ) || false
        : false;

      // La logique d'accès doit refléter les états décrits
      const hasAccess =
        isPublic ||
        isAdmin ||
        isGuest ||
        isTempGuest ||
        (!isRestricted && isPrivate);

      setAccessControl({
        isPublic,
        isPrivate,
        isRestricted,
        isAdmin,
        isGuest,
        isTempGuest,
        hasAccess,
      });
    } else {
      setAccessControl((prev) => ({
        ...prev,
        hasAccess: false, // Si pas d'event ou user
      }));
    }

    setIsLoading(false);
  }, [event, user, params]);

  // Affichage de l'événement
  if (isLoading || !event || !accessControl.hasAccess) {
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
            <div className="md:p-10 md:pl-0 p-4 h-full ">
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
                <span className="text-sm">{renderDate(event)}</span>
              </div>
              <RenderMedia event={event} />
              <DeleteEventButton
                eventId={event._id}
                isHost={accessControl.isAdmin}
              />
            </div>
            <Section className="justify-start py-10 w-full h-full">
              <TabSelector
                onChange={setSelectedTab}
                tabs={
                  [
                    "Description",
                    "Attendees",
                    accessControl.isAdmin ? "Settings" : null,
                  ].filter(Boolean) as string[]
                }
                className="mb-10"
              />
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
              {selectedTab === "Settings" && (
                <EventEdit
                  event={event}
                  allUsers={users}
                  onUpdateField={handleUpdateField}
                />
              )}
            </Section>
          </div>
        </>
      )}
    </>
  );
};

export default EventIdTabs;
