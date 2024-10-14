"use client";

import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/Loader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UsersList from "@/components/UsersList";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import { filterEvents } from "@/features/discover/discoverActions";
import MyGoogleMapComponent from "@/features/discover/MyGoogleMapComponent";
import TabSelector from "@/features/discover/TabSelector";
import Event from "@/features/event/components/Event";
import EventModal from "@/features/event/components/EventModal";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store/useGlobalStore";
import { EventType, InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { format, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  MenuIcon,
  Search,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Location {
  lat: number;
  lng: number;
}

const DiscoverPage = () => {
  const [selectedInterests, setSelectedInterests] = useState<InterestType[]>(
    [],
  );
  const { users, interests, events } = useGlobalStore();
  const [showReset, setShowReset] = useState(false);
  const today = startOfDay(new Date());
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedTab, setSelectedTab] = useState("All events");
  const [location, setLocation] = useState<Location | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>(
    events || [],
  );
  const [isPending, setIsPending] = useState(false);
  const session = useSession();
  const [isHydrated, setIsHydrated] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false);
  // Wait until the client has fully hydrated to prevent SSR mismatches
  useEffect(() => {
    setIsHydrated(true);
    setIsPending(false);
  }, []);
  const handleInterestToggle = (interest: InterestType) => {
    setSelectedInterests((prev) =>
      prev.some((i) => i._id === interest._id)
        ? prev.filter((i) => i._id !== interest._id)
        : [...prev, interest],
    );
  };

  useEffect(() => {
    // const formattedStartDate = startDate ? startDate.toISOString() : "";
    // const formattedEndDate = endDate ? endDate.toISOString() : "";
    if (events && events.length > 0) {
      const filteredEvents = filterEvents(
        events,
        selectedInterests,
        searchText,
        selectedTab,
        location,
        startDate,
        endDate,
      );
      setFilteredEvents(filteredEvents);
    }
  }, [
    selectedInterests,
    searchText,
    selectedTab,
    events,
    location,
    events,
    events,
    interests,
    users,
    startDate,
    endDate,
  ]);

  if (!isHydrated) {
    return null;
  }
  const handleEventClick = (event: EventType) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };
  const resetDate = () => {
    setStartDate(null);
    setEndDate(null);
    setShowReset(false);
  };
  const handleStartDateChange = (date: Date | undefined) => {
    if (date && date >= today) {
      setStartDate(date);
      if (!endDate || date > endDate) {
        setEndDate(date);
      }
    }
    setShowReset(true);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!startDate) {
      setStartDate(today);
    }
    setEndDate(date || null);
    setShowReset(true);
  };
  return (
    <>
      <div className="relative flex justify-center items-center mt-10 text-eventoPurpleLight gap-2">
        <h2 className="animate-slideInLeft font-black opacity-0">
          <span>Discover Events</span>
        </h2>
        {/* <h2 className="event-text animate-slideInRight flex opacity-0 items-center bg-evento-gradient text-white rounded shadow">
          <span className=" flex justify-center items-center">
            <img src="/logo.png" alt="E" className="w-12 h-12" />
          </span>
          <span className="-translate-x-1.5">vents</span>
        </h2> */}
      </div>
      <Section className="flex flex-col-reverse md:grid md:grid-cols-3  md:gap-0 items-start justify-end px-0">
        <ul className="w-full space-y-6 col-span-2">
          <li className="flex items-center sticky top-0 z-10 bg-muted py-4 flex-col gap-4 px-4">
            <TabSelector
              onChange={setSelectedTab}
              tabs={["All events", "Near me", "Virtual"]}
            />
            <span className="flex gap-2 md:hidden">
              Show filters
              <MenuIcon onClick={() => setToggleSearch(!toggleSearch)} />
            </span>
          </li>
          {isPending ? (
            <div className="w-full h-96 rounded">
              <Loader />
            </div>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <li
                key={event._id}
                onClick={() => handleEventClick(event)}
                className="px-4"
              >
                <Event event={event} />
              </li>
            ))
          ) : (
            <li className="text-muted-foreground text-center space-y-4">
              <p>No events found.</p>
              <Button asChild className="bg-evento-gradient hover:opacity-80">
                <Link href="/create-event">Creat one today !</Link>
              </Button>
            </li>
          )}
        </ul>
        <div
          className={cn(
            "flex flex-col gap-2 w-full transition-all duration-300 bg-muted md:translate-x-0 md:max-h-fit md:opacity-100 px-4",
            {
              "translate-x-[-100%] h-0 opacity-0": !toggleSearch,
              "translate-x-0 max-h-fit sticky opacity-100 z-20 top-0 pt-5":
                toggleSearch,
            },
          )}
        >
          <XIcon
            className="md:hidden self-end"
            onClick={() => setToggleSearch(!toggleSearch)}
          />
          <div className="flex flex-col gap-2 md:p-4 py-0 pt-0 rounded bg-muted">
            {/* <LocationSelector onLocationChange={setLocation} /> */}
            <MyGoogleMapComponent
              location={location || { lat: 0, lng: 0 }}
              setLocation={setLocation}
            />
          </div>
          <div className="relative flex items-center md:p-4">
            <Search
              className="w-6 h-6 absolute left-3 md:left-6 text-eventoPurpleDark"
              strokeWidth={2.5}
            />
            <Input
              type="text"
              placeholder="Search for events or organisers ..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-12 border-none bg-white py-2 rounded-lg w-full"
            />
          </div>
          <div className="md:p-4  gap-4 ">
            <div className="flex justify-between items-center ">
              <h4 className=" text-purple-600 font-bold">Select Date</h4>
              {showReset && (
                <button
                  onClick={resetDate}
                  className=" text-sm hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="relative flex flex-col gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "dd/MM/yyyy")
                    ) : (
                      <span>Select Start Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate || today}
                    onSelect={handleStartDateChange}
                    initialFocus
                    fromDate={today}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "dd/MM/yyyy")
                    ) : (
                      <span>Select End Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate || today}
                    onSelect={handleEndDateChange}
                    initialFocus
                    fromDate={startDate || today}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="p-4">
            <h4 className="text-purple-600 font-bold">Select Interests</h4>
            <ul className="flex flex-wrap gap-4 mt-4">
              {interests.map((interest) => (
                <Button
                  key={interest._id}
                  asChild
                  className={cn(
                    "cursor-pointer bg-gray-200 text-black hover:bg-eventoPurpleLight/60",
                    {
                      "bg-evento-gradient text-white":
                        selectedInterests.includes(interest),
                    },
                  )}
                >
                  <li onClick={() => handleInterestToggle(interest)}>
                    {interest.name}
                  </li>
                </Button>
              ))}
            </ul>
          </div>{" "}
          <div className="p-4 hidden md:block">
            <h4 className="text-purple-600 font-bold">Follow Suggestions</h4>
            <ul className="space-y-4 py-4">
              {session.isAuthenticated ? (
                users.map((user: UserType) => (
                  <li key={user._id} className="flex justify-between">
                    <UsersList user={user} />
                  </li>
                ))
              ) : (
                <>
                  <p>Login to find friend who like same interest than you !</p>
                  <Button
                    className="bg-evento-gradient w-full"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Login
                  </Button>
                </>
              )}
            </ul>
          </div>
        </div>
        {isAuthModalOpen && (
          <AuthModal
            onAuthSuccess={() => setIsAuthModalOpen(false)}
            onClose={() => setIsAuthModalOpen(false)}
          />
        )}{" "}
        <EventModal
          isOpen={isEventModalOpen}
          event={selectedEvent}
          onClose={() => setIsEventModalOpen(false)}
        />
      </Section>
    </>
  );
};

export default DiscoverPage;
