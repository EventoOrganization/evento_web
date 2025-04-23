"use client";

import EventoLoader from "@/components/EventoLoader";
import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UsersList from "@/components/UsersList";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import { filterEvents, filterUsers } from "@/features/discover/discoverActions";
import TabSelector from "@/features/discover/TabSelector";
import Event from "@/features/event/components/Event";
import EventModal from "@/features/event/components/EventModal";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventsStore";
import { useInterestsStore } from "@/store/useInterestsStore";
import { useUsersStore } from "@/store/useUsersStore";
import { EventType, InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { format, startOfDay } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronDownIcon,
  FilterIcon,
  Search,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import SmartGooglePlacesInput from "./SmartGooglePlacesInput";

interface Location {
  lat: number;
  lng: number;
}

const DiscoverPageContent = () => {
  // Provider data
  const session = useSession();
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
  const [showReset, setShowReset] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>();
  const { users } = useUsersStore();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedTab, setSelectedTab] = useState("All events");
  const [location, setLocation] = useState<Location | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false);
  useEffect(() => {
    if (!isHydrated && events) {
      setIsHydrated(true);
    }
  }, [events]);

  const {
    filteredUsers,
    friends,
    usersYouMayKnow,
    usersWithSharedInterests,
    generalSuggestions,
  } = filterUsers(users, selectedInterests, searchText);
  const fiteredAndSortedEvent = filterEvents(
    events,
    selectedInterests,
    searchText,
    selectedTab,
    location,
    startDate,
    endDate,
    users,
  );
  const handleEventClick = (event: EventType) => {
    const storedEvent = events.find((ev) => ev._id === event._id);
    setSelectedEvent(storedEvent);
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
  const [SeeMoreCount, setSeeMoreCount] = useState<number>(10);

  const handleSeeMore = () => {
    setSeeMoreCount(SeeMoreCount + 10);
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
      {!isHydrated ? (
        <div className="flex justify-center items-center min-h-screen">
          <EventoLoader />
        </div>
      ) : (
        <>
          {!toggleSearch && (
            <h1
              className={
                "animate-slideInLeft opacity-0 text-3xl md:text-4xl lg:text-5xl flex justify-center md:justify-start md:font-bold text-black w-full mb-6 mt-10 h-fit px-4"
              }
            >
              Discover Events
            </h1>
          )}
          <Section className="flex flex-col-reverse md:grid  md:grid-cols-3  md:gap-0 items-start justify-end pt-0 px-0 ">
            <ul className="w-full md:col-span-2 md:pl-4">
              <li className="flex items-center sticky top-0 z-20 bg-muted p-2 md:mb-2 md:px-0 md:py-0 flex-col gap-2">
                <TabSelector
                  onChange={setSelectedTab}
                  tabs={["All events", "Near me", "Virtual"]}
                />
                <div className="flex justify-between w-full items-center md:hidden gap-2">
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
                      onClick={() => setToggleSearch(!toggleSearch)}
                    />
                  </Button>
                </div>
              </li>
              {searchText.length > 2 && filteredUsers.length > 0 && (
                <li className="px-4">
                  <div className="space-y-4 mb-20">
                    {/* Friends */}
                    {searchText && friends.length > 0 && (
                      <div>
                        <Label className="text-sm">Your friends</Label>
                        <ul className="space-y-2">
                          {friends.map((user: UserType) => (
                            <li key={user._id} className="flex justify-between">
                              <UsersList user={user} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Users You May Know */}
                    {usersYouMayKnow.length > 0 && (
                      <div>
                        <Label className="text-sm">You may know them</Label>
                        <ul className="space-y-2">
                          {usersYouMayKnow.map((user: UserType) => (
                            <li key={user._id} className="flex justify-between">
                              <UsersList user={user} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Users with Shared Interests */}
                    {usersWithSharedInterests.length > 0 && (
                      <div>
                        <Label className="text-sm">
                          They share your interests
                        </Label>
                        <ul className="space-y-2">
                          {usersWithSharedInterests.map((user: UserType) => (
                            <li key={user._id} className="flex justify-between">
                              <UsersList user={user} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* General Suggestions */}
                    {generalSuggestions.length > 0 && (
                      <div>
                        <Label className="text-sm">Other users</Label>
                        <ul className="space-y-2">
                          {generalSuggestions
                            .slice(0, SeeMoreCount)
                            .map((user: UserType) => (
                              <li
                                key={user._id}
                                className="flex justify-between"
                              >
                                <UsersList user={user} />
                              </li>
                            ))}
                        </ul>
                        {generalSuggestions.length > SeeMoreCount && (
                          <p
                            className="text-sm text-blue-400 underline cursor-pointer flex gap-2"
                            onClick={handleSeeMore}
                          >
                            <ChevronDownIcon /> See more
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              )}
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
                <li className="text-muted-foreground text-center space-y-4 min-h-screen">
                  <p>No events found.</p>
                  <Button
                    asChild
                    className="bg-evento-gradient hover:opacity-80"
                  >
                    <Link href="/create-event">Create one today!</Link>
                  </Button>
                </li>
              )}
            </ul>
            <div
              className={cn(
                "text-xs flex flex-col gap-2 w-full transition-all duration-300 bg-muted px-4",
                {
                  "translate-x-[-100%] md:translate-x-0 h-0 opacity-0 md:opacity-100":
                    !toggleSearch,
                  "translate-x-0 max-h-[80vh] sticky border-b-2 opacity-100 z-20 top-0 pt-5 overflow-y-auto pb-20":
                    toggleSearch,
                },
              )}
            >
              <h2 className="pl-4">Filters</h2>
              <Button
                onClick={() => setToggleSearch(!toggleSearch)}
                className="md:hidden absolute bottom-4 right-4 p-2 bg-eventoPurpleDark"
              >
                <XIcon className=" w-6 h-6" />
              </Button>
              <div className="relative flex items-center md:p-4">
                <Search
                  className="w-4 h-4 absolute left-3 md:left-6 text-muted-foreground"
                  strokeWidth={2}
                />
                <Input
                  type="text"
                  placeholder="Search for events or users ..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-10 border-none py-2 rounded-lg w-full text-xs md:text-sm"
                />
              </div>
              <div className="flex flex-col gap-2 md:p-4 py-0 pt-0 rounded bg-muted">
                {/* <NewAPIGoogleMapComponent
                  location={location || { lat: 0, lng: 0 }}
                  setLocation={setLocation}
                /> */}
                {/* <MyGoogleMapComponent
                  location={location || { lat: 0, lng: 0 }}
                  setLocation={setLocation}
                /> */}
                <SmartGooglePlacesInput
                  location={location || { lat: 0, lng: 0 }}
                  setLocation={setLocation}
                />
              </div>
              <div className="md:p-4  gap-4 ">
                <div className="flex justify-between items-center ">
                  {showReset && (
                    <button
                      onClick={resetDate}
                      className=" text-sm hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="relative grid grid-cols-2 gap-2">
                  <Label htmlFor="start-date-filter">Start Date</Label>
                  <Label htmlFor="end-date-filter">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="start-date-filter"
                        variant="outline"
                        className=" text-muted-foreground w-full justify-start text-left text-xs md:text-sm"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "dd/MM/yyyy")
                        ) : (
                          <span>Pick a date</span>
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
                        locale={enUS}
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="end-date-filter"
                        variant="outline"
                        className="text-muted-foreground w-full justify-start text-left text-xs md:text-sm"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, "dd/MM/yyyy")
                        ) : (
                          <span>Pick a date</span>
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
                        locale={enUS}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="p-4">
                <Label htmlFor="interests-category">Interests category</Label>
                <ul
                  id="interests-category"
                  className="flex flex-wrap gap-4 mt-4"
                >
                  {interests.map((interest) => {
                    const isSelected = selectedInterests.some(
                      (i) => i._id === interest._id,
                    );

                    return (
                      <li
                        key={interest._id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedInterests((prev) =>
                              prev.filter((i) => i._id !== interest._id),
                            );
                          } else {
                            const updatedInterests = [
                              ...selectedInterests,
                              interest,
                            ];
                            setSelectedInterests(updatedInterests);
                          }
                        }}
                        className={`cursor-pointer px-2 py-2 md:text-sm rounded-md border w-fit flex items-center justify-center ${
                          isSelected
                            ? "bg-black text-white"
                            : "bg-gray-200 text-muted-foreground hover:bg-gray-300"
                        }`}
                      >
                        {isSelected && <Check className="mr-2 w-4 h-4" />}
                        {interest.name}
                      </li>
                    );
                  })}
                </ul>
              </div>{" "}
              <div className="p-4 hidden lg:block">
                <div className="space-y-4 mb-20">
                  {session.isAuthenticated ? (
                    <div className="space-y-4 mb-20">
                      {/* Friends */}
                      {searchText && friends.length > 0 && (
                        <div>
                          <Label className="text-sm">Your friends</Label>
                          <ul className="space-y-2">
                            {friends.map((user: UserType) => (
                              <li
                                key={user._id}
                                className="flex justify-between"
                              >
                                <UsersList user={user} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Users You May Know */}
                      {usersYouMayKnow.length > 0 && (
                        <div>
                          <Label className="text-sm">You may know them</Label>
                          <ul className="space-y-2">
                            {usersYouMayKnow.map((user: UserType) => (
                              <li
                                key={user._id}
                                className="flex justify-between"
                              >
                                <UsersList user={user} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Users with Shared Interests */}
                      {usersWithSharedInterests.length > 0 && (
                        <div>
                          <Label className="text-sm">
                            They share your interests
                          </Label>
                          <ul className="space-y-2">
                            {usersWithSharedInterests.map((user: UserType) => (
                              <li
                                key={user._id}
                                className="flex justify-between"
                              >
                                <UsersList user={user} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* General Suggestions */}
                      {generalSuggestions.length > 0 && (
                        <div>
                          <Label className="text-sm">Other users</Label>
                          <ul className="space-y-2">
                            {generalSuggestions
                              .slice(0, SeeMoreCount)
                              .map((user: UserType) => (
                                <li
                                  key={user._id}
                                  className="flex justify-between"
                                >
                                  <UsersList user={user} />
                                </li>
                              ))}
                          </ul>
                          {generalSuggestions.length > SeeMoreCount && (
                            <p
                              className="text-sm text-blue-400 underline cursor-pointer flex gap-2"
                              onClick={handleSeeMore}
                            >
                              <ChevronDownIcon /> See more
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <Label className="text-sm">Follow Suggestions</Label>
                      <p>
                        Log in to find friends who have the same interests as
                        you!
                      </p>
                      <Button
                        className="bg-evento-gradient w-full"
                        onClick={() => setIsAuthModalOpen(true)}
                      >
                        Login
                      </Button>
                    </>
                  )}
                </div>
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
      )}
    </>
  );
};

export default DiscoverPageContent;
