"use client";

import EventoLoader from "@/components/EventoLoader";
import AuthModal from "@/components/system/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { filterEvents } from "@/features/discover/discoverActions";
import TabSelector from "@/features/discover/TabSelector";
import Event from "@/features/event/components/Event";
import EventModal from "@/features/event/components/EventModal";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventsStore";
import { useInterestsStore } from "@/store/useInterestsStore";
import { useUsersStore } from "@/store/useUsersStore";
import { EventType, InterestType } from "@/types/EventType";
import { startOfDay } from "date-fns";
import { FilterIcon, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import EventsFilters from "./components/events-filters";
import EventUsersLists from "./components/events-users-lists";

const PageEvents = () => {
  // Provider data
  const { isAuthenticated } = useSession();
  // Stored data
  const { interests } = useInterestsStore();
  const today = startOfDay(new Date());
  const events = useEventStore((state) => state.events).filter(
    (event) =>
      event.details?.endDate && new Date(event.details.endDate) > today,
  );
  // local state
  const [selectedInterests, setSelectedInterests] = useState<InterestType[]>(
    [],
  );

  const [selectedEvent, setSelectedEvent] = useState<EventType | null>();
  const { users } = useUsersStore();
  const [showFilters, setShowFilters] = useState(true);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedTab, setSelectedTab] = useState("All events");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (!isHydrated && events) {
      setIsHydrated(true);
    }
  }, [events]);

  const fiteredAndSortedEvent = filterEvents(
    events,
    selectedInterests,
    searchText,
    selectedTab,
    location ? location : { lat: 0, lng: 0 },
    startDate,
    endDate,
    users,
  );
  const handleEventClick = (event: EventType) => {
    const storedEvent = events.find((ev) => ev._id === event._id);
    setSelectedEvent(storedEvent);
    setIsEventModalOpen(true);
  };
  if (!isHydrated) {
    return (
      <div className="flex justify-center items-center min-h-screen col-span-2">
        <EventoLoader />
      </div>
    );
  }
  return (
    <>
      <h1
        className={
          "col-span-2 animate-slideInLeft opacity-0 text-3xl md:text-4xl lg:text-5xl flex justify-center md:justify-start md:font-bold text-black w-full mb-6 mt-10 h-fit px-4"
        }
      >
        Discover Events
      </h1>
      <main className="col-span-2 md:col-span-1 space-y-2">
        <div className="flex flex-col gap-2 bg-muted sticky top-0 z-50">
          <TabSelector
            onChange={setSelectedTab}
            tabs={["All events", "Near me", "Virtual"]}
          />
          <div
            className={cn(
              "flex justify-between w-full items-center md:hidden gap-2 bg-muted pb-2",
            )}
          >
            <div className="relative flex items-center w-full">
              <Search
                className="w-4 h-4 absolute left-3 md:left-6 text-muted-foreground "
                strokeWidth={2}
              />
              <Input
                type="text"
                placeholder="Search for events or users ..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 border-none py-2 rounded-lg  text-xs md:text-sm w-full"
              />
            </div>
            <Button className=" p-2 bg-muted" variant={"outline"}>
              <FilterIcon
                className="w-5 h-5"
                onClick={() => setShowFilters(!showFilters)}
              />
            </Button>
          </div>
          <EventsFilters
            className="md:hidden"
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            searchText={searchText}
            setSearchText={setSearchText}
            location={location ? location : { lat: 0, lng: 0 }}
            setLocation={setLocation}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            interests={interests}
            selectedInterests={selectedInterests}
            setSelectedInterests={setSelectedInterests}
          />
        </div>
        <ul>
          {fiteredAndSortedEvent.length > 0 ? (
            fiteredAndSortedEvent.map((event, index) => (
              <li
                key={event._id}
                onClick={() => handleEventClick(event)}
                className="border-b-2 pb-6 md:border-none"
              >
                <Event event={event} index={index} />
              </li>
            ))
          ) : (
            <li className="text-muted-foreground text-center space-y-4 ">
              <p>No events found.</p>
              <Button asChild className="bg-evento-gradient hover:opacity-80">
                <Link href="/events/create">Create one today!</Link>
              </Button>
            </li>
          )}
        </ul>
      </main>
      <aside className="space-y-2">
        <EventsFilters
          // className="md:sticky top-0 z-10"
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          searchText={searchText}
          setSearchText={setSearchText}
          location={location ? location : { lat: 0, lng: 0 }}
          setLocation={setLocation}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          interests={interests}
          selectedInterests={selectedInterests}
          setSelectedInterests={setSelectedInterests}
        />
        {isAuthenticated ? (
          <EventUsersLists
            className="sticky top-16 z-10 space-y-2"
            searchText={searchText}
            selectedInterests={selectedInterests}
          />
        ) : (
          <div className="sticky top-16 z-10 space-y-2">
            <Label className="text-sm">Follow Suggestions</Label>
            <p>Log in to find friends who have the same interests as you!</p>
            <Button
              className="bg-evento-gradient w-full"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Login
            </Button>
          </div>
        )}
      </aside>
      {isAuthModalOpen && (
        <AuthModal
          onAuthSuccess={() => setIsAuthModalOpen(false)}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
      <EventModal
        isOpen={isEventModalOpen}
        event={selectedEvent}
        onClose={() => setIsEventModalOpen(false)}
      />
    </>
  );
};

export default PageEvents;
