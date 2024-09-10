"use client";

import Section from "@/components/layout/Section";
import LocationSelector from "@/components/map/LocationSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UserPrevirew from "@/components/UsersList";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import DateSelector from "@/features/discover/DateSelector";
import { filterEvents } from "@/features/discover/discoverActions";
import TabSelector from "@/features/discover/TabSelector";
import Event from "@/features/event/components/Event";
import EventModal from "@/features/event/components/EventModal";
import { cn } from "@/lib/utils";
import useEventoStore from "@/store/useEventoStore";
import { EventType, InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface Location {
  lat: number;
  lng: number;
}

const DiscoverPage = () => {
  const {
    users,
    events,
    interests,
    loadInterests,
    loadUpcomingEvents,
    loadUsersPlus,
  } = useEventoStore();
  const [selectedInterests, setSelectedInterests] = useState<InterestType[]>(
    [],
  );
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTab, setSelectedTab] = useState("All");
  const [location, setLocation] = useState<Location | null>(null);
  const [distanceFilter, setDistanceFilter] = useState(10);
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>([]);
  // const [filterUsers, setFilterUsers] = useState<UserType[]>([]);
  const session = useSession();
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait until the client has fully hydrated to prevent SSR mismatches
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  useEffect(() => {
    loadInterests();
    loadUpcomingEvents(session.user || undefined);
    if (session.user && session.token)
      loadUsersPlus(session.user._id, session.token);
  }, []);

  const handleInterestToggle = (interest: InterestType) => {
    setSelectedInterests((prev) =>
      prev.some((i) => i._id === interest._id)
        ? prev.filter((i) => i._id !== interest._id)
        : [...prev, interest],
    );
  };

  useEffect(() => {
    const formattedDate = selectedDate ? selectedDate.toISOString() : "";
    if (users && users.length > 0 && events && events.length > 0) {
      const filteredEvents = filterEvents(
        events,
        selectedInterests,
        searchText,
        formattedDate,
        selectedTab,
        location,
        distanceFilter,
      );

      setFilteredEvents(filteredEvents);
    }
  }, [
    selectedInterests,
    searchText,
    selectedDate,
    selectedTab,
    events,
    location,
    distanceFilter,
  ]);

  if (!isHydrated) {
    return null;
  }
  const handleEventClick = (event: EventType) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };
  return (
    <>
      <div className="relative flex justify-center items-center mt-10 text-eventoPurpleLight gap-2">
        <h2 className="animate-slideInLeft font-black opacity-0">
          <span>Discover</span>
        </h2>
        <h2 className="event-text animate-slideInRight flex opacity-0 items-center bg-evento-gradient text-white rounded shadow">
          <span className=" flex justify-center items-center">
            <img src="/logo.png" alt="E" className="w-12 h-12" />
          </span>
          <span className="-translate-x-1.5">vents</span>
        </h2>
      </div>
      <Section className="flex flex-col-reverse md:grid md:grid-cols-2 gap-20 items-start">
        <ul className="w-full space-y-6">
          <TabSelector
            onChange={setSelectedTab}
            tabs={["All", "Near me", "Virtual"]}
          />
          {filteredEvents &&
            filteredEvents.map((event) => (
              <li key={event._id} onClick={() => handleEventClick(event)}>
                <Event event={event} />
              </li>
            ))}
        </ul>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 p-4 rounded bg-muted">
            <h4 className="text-purple-600 font-bold">Current Location</h4>
            <LocationSelector onLocationChange={setLocation} />
          </div>
          <div className="relative flex items-center p-4">
            <Search
              className="w-6 h-6 absolute left-6 text-eventoPurpleDark"
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
          <div className="p-4 flex gap-4">
            <h4 className="cursor-pointer text-purple-600 font-bold">
              Select Date
            </h4>
            <DateSelector
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>
          {selectedTab === "Near me" && (
            <div className="hidden">
              <Label>Distance (km):</Label>
              <Input
                type="number"
                value={distanceFilter}
                onChange={(e) => setDistanceFilter(parseInt(e.target.value))}
                min="1"
                max="100"
              />
            </div>
          )}
          <div className="p-4">
            <h4 className="text-purple-600 font-bold">Select Interests</h4>
            <ul className="flex flex-wrap gap-4 mt-4">
              {interests.map((interest) => (
                <li
                  key={interest._id}
                  onClick={() => handleInterestToggle(interest)}
                  className={cn(
                    "cursor-pointer bg-gray-200 rounded px-2 py-1 w-fit hover:bg-eventoPurpleLight/50 focus:border-eventoBlue",
                    {
                      "bg-eventoPurpleLight/20":
                        selectedInterests.includes(interest),
                    },
                  )}
                >
                  {interest.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 hidden md:block">
            <h4 className="text-purple-600 font-bold">Follow Suggestions</h4>
            <ul className="space-y-4 py-4">
              {session.isAuthenticated ? (
                users.map((user: UserType) => (
                  <li key={user._id} className="flex justify-between">
                    <UserPrevirew user={user} />
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
          <AuthModal onAuthSuccess={() => setIsAuthModalOpen(false)} />
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
