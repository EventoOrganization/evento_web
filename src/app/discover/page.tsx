"use client";

import { useSession } from "@/contexts/SessionProvider";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useEffect, useState } from "react";

import Section from "@/components/layout/Section";
import LocationSelector from "@/components/map/LocationSelector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UserPrevirew from "@/components/UsersList";
import { filterEvents, filterUsers } from "@/features/discover/discoverActions";
import TabSelector from "@/features/discover/TabSelector";
import Event from "@/features/event/components/Event";
import { cn } from "@/lib/utils";
import { EventType, InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { Search } from "lucide-react";
interface Location {
  lat: number;
  lng: number;
}
const DiscoverPage = () => {
  const [events, setEvents] = useState<EventType[]>([] as any[]);
  const [users, setUsers] = useState<any>([] as any[]);
  const [interests, setInterests] = useState<InterestType[]>([] as any[]);
  const [selectedInterests, setSelectedInterests] = useState<InterestType[]>(
    [],
  );
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedTab, setSelectedTab] = useState("All");
  const [location, setLocation] = useState<Location | null>(null);
  const [distanceFilter, setDistanceFilter] = useState(10);
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [filteredUsers, setFilteredUsers] = useState([] as UserType[]);
  const session = useSession();
  const getInterests = async () => {
    try {
      const interestRes = await fetchData<any>("/users/getInterestsListing");
      if (!interestRes.error) {
        setInterests(interestRes.data);
      }
    } catch (error) {
    } finally {
    }
  };
  const getUpcomingEvents = async () => {
    try {
      const upcomingEventRes = await fetchData<any>(
        "/events/getUpcomingEvents",
      );
      if (!upcomingEventRes.error) {
        setEvents(upcomingEventRes.data);
        // console.log("Upcoming event", upcomingEventRes.data);
      }
    } catch (error) {
    } finally {
    }
  };
  const getUsers = async () => {
    try {
      const usersRes = await fetchData<any>("/users/allUserListing");
      if (!usersRes.error) {
        setUsers(usersRes.data);
      }
    } catch (error) {
    } finally {
    }
  };
  const getUsersPlus = async () => {
    try {
      const usersRes = await fetchData<any>(
        `/users/followStatusForUsersYouFollow/${session?.user?._id}`,
        HttpMethod.GET,
        null,
        session?.token,
      );

      if (!usersRes.error) {
        setUsers(usersRes.data);
        // console.log(usersRes.data);
      }
    } catch (error) {
    } finally {
    }
  };
  useEffect(() => {
    // console.log("session", session);
    if (!interests.length) getInterests();
    if (!events.length) getUpcomingEvents();
    if (!session?.user && !session?.token) {
      getUsers();
    } else {
      getUsersPlus();
    }
  }, [session]);

  const handleInterestToggle = (interest: InterestType) => {
    setSelectedInterests((prev) =>
      prev.some((i) => i._id === interest._id)
        ? prev.filter((i) => i._id !== interest._id)
        : [...prev, interest],
    );
  };
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setStartDate(newDate); // Now setting as a Date object
    if (endDate && newDate > endDate) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(new Date(e.target.value)); //
  };

  useEffect(() => {
    const formattedStartDate = startDate
      ? startDate.toISOString().substring(0, 10)
      : "";
    const formattedEndDate = endDate
      ? endDate.toISOString().substring(0, 10)
      : null;
    if (users && users.length > 0 && events && events.length > 0) {
      const filteredEvents = filterEvents(
        events,
        selectedInterests,
        searchText,
        formattedStartDate,
        formattedEndDate,
        selectedTab,
        location,
        distanceFilter,
      );

      const filteredUsers = filterUsers(
        users,
        selectedInterests,
        searchText,
        interests,
      );

      setFilteredEvents(filteredEvents);
      setFilteredUsers(filteredUsers);
    }
  }, [
    selectedInterests,
    searchText,
    startDate,
    endDate,
    selectedTab,
    events,
    users,
    location,
    distanceFilter,
  ]);

  return (
    <>
      <Section className="flex flex-col-reverse md:grid md:grid-cols-2 gap-20 items-start">
        <ul className="w-full space-y-6">
          <TabSelector onChange={setSelectedTab} />
          {filteredEvents.map((event) => (
            <li key={event._id}>
              <Event event={event} />
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 rounded bg-muted">
            <h4 className="text-purple-600 font-bold">Current Location</h4>
            <LocationSelector onLocationChange={setLocation} />
          </div>
          <div className="relative flex items-center">
            <Search
              className="w-6 h-6 absolute left-4 text-eventoPurpleDark"
              strokeWidth={2.5}
            />
            <Input
              type="text"
              placeholder="Search for events or organisers ..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-14 border-none bg-white py-2 rounded-lg w-full"
            />
          </div>
          <div className="mt-4 flex gap-4">
            <h4 className="cursor-pointer text-purple-600 font-bold">
              Select Date
            </h4>{" "}
            <div className="flex flex-col gap-2">
              <Input
                type="date"
                value={
                  startDate ? startDate.toISOString().substring(0, 10) : ""
                }
                onChange={handleStartDateChange}
                className="cursor-pointer "
              />
              {startDate && (
                <Input
                  type="date"
                  value={endDate ? endDate.toISOString().substring(0, 10) : ""}
                  onChange={handleEndDateChange}
                  min={
                    startDate
                      ? startDate.toISOString().substring(0, 10)
                      : undefined
                  }
                  className="cursor-pointer"
                />
              )}
            </div>
            {startDate && (
              <button
                className="text-sm py-2 self-start"
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                }}
              >
                Reset
              </button>
            )}
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
          <div className="mt-4">
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
          <div className="mt-4 hidden md:block">
            <h4 className="text-purple-600 font-bold">Follow Suggestions</h4>
            <ul className="space-y-4 py-4">
              {filteredUsers.map((user) => (
                <li key={user._id} className="flex justify-between">
                  <UserPrevirew user={user} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
};

export default DiscoverPage;
