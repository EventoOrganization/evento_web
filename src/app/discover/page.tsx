"use client";
import Section from "@/components/layout/Section";
import LocationSelector from "@/components/map/LocationSelector";
import Showcase from "@/components/Showcase";
import { Input } from "@/components/ui/input";
import { useDiscoverContext } from "@/contexts/DiscoverContext";
import DateSelector from "@/features/discover/DateSelector";
import TabSelector from "@/features/discover/TabSelector";
import Event from "@/features/event/components/Event";
import { cn } from "@/lib/utils";
import { EventType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { Label } from "@radix-ui/react-label";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface Location {
  lat: number;
  lng: number;
}
const DiscoverPage = () => {
  //Filters
  const { interests, events, users } = useDiscoverContext();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTab, setSelectedTab] = useState("All");
  const [location, setLocation] = useState<Location | null>(null);
  const [distanceFilter, setDistanceFilter] = useState(10);
  // displayedDatas
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [filteredUsers, setFilteredUsers] = useState(users);

  const handleInterestToggle = (interestId: string) => {
    console.log("interestId", interestId);
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((i) => i !== interestId)
        : [...prev, interestId],
    );
  };

  useEffect(() => {
    console.log("selectedInterests", selectedInterests);
    console.log("filteredUsers", filteredUsers);
    console.log("searchText", searchText);
    console.log("selectedDate", selectedDate);
    console.log("events", events);
    // console.log("selectedTab", selectedTab);
    // console.log("location", location);
    // console.log("distanceFilter", distanceFilter);
    if (users && users.length > 0) {
      setFilteredEvents(
        filterEvents(
          events,
          selectedInterests,
          searchText,
          selectedDate,
          selectedTab,
          location,
          distanceFilter,
        ),
      );

      const filtered = filterUsers(users, selectedInterests, searchText);
      setFilteredUsers(filtered);
    }
  }, [
    selectedInterests,
    searchText,
    selectedDate,
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
                  onClick={() => handleInterestToggle(interest._id)}
                  className={cn(
                    "cursor-pointer bg-gray-200 rounded px-2 py-1 w-fit hover:bg-eventoPurpleLight/50 focus:border-eventoBlue",
                    {
                      "bg-eventoPurpleLight/20": selectedInterests.includes(
                        interest._id,
                      ),
                    },
                  )}
                >
                  {interest.name}
                </li>
              ))}
            </ul>
          </div>
          <Showcase
            users={filteredUsers}
            className="flex-row flex-wrap"
            itemClassName="w-full justify-between flex"
          />
        </div>
      </Section>
    </>
  );
};

export default DiscoverPage;

// Fonction pour calculer la distance entre deux points (en km)
const getDistanceFromLatLonInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Rayon de la terre en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon1 - lon2) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance en km
  return distance;
};
// Fonction de filtrage des événements
const filterEvents = (
  events: EventType[],
  selectedInterests: string[],
  searchText: string,
  selectedDate: string,
  selectedTab: string,
  location: Location | null,
  distanceFilter: number,
) => {
  const searchLower = searchText.toLowerCase();
  return events.filter((event) => {
    const matchesInterest =
      selectedInterests.length === 0 ||
      selectedInterests.some((interestId) => {
        const result = event.interest?.includes(interestId);
        return result;
      });

    const matchesSearchText =
      event.title?.toLowerCase().includes(searchLower) ||
      event.details?.description?.toLowerCase().includes(searchLower);

    const matchesDate = !selectedDate || event.details?.date === selectedDate;

    const isNearMe =
      selectedTab === "Near me" &&
      location &&
      getDistanceFromLatLonInKm(
        location.lat,
        location.lng,
        event.details?.loc?.coordinates[1] || 0,
        event.details?.loc?.coordinates[0] || 0,
      ) <= distanceFilter;

    const isVirtual =
      selectedTab === "Virtual" && event.details?.mode === "virtual";

    const matchesTab = selectedTab === "All" || isNearMe || isVirtual;

    return matchesInterest && matchesSearchText && matchesDate && matchesTab;
  });
};
// Fonction de filtrage des utilisateurs
const filterUsers = (
  users: UserType[],
  selectedInterests: string[],
  searchText: string,
) => {
  const searchLower = searchText.toLowerCase();

  return users.filter((user) => {
    const matchesInterest =
      selectedInterests.length === 0 ||
      selectedInterests.some((interestId) =>
        user.interests?.some((userInterest) => userInterest._id === interestId),
      );

    const userName =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || user.lastName || "";

    const matchesSearchText = userName.toLowerCase().includes(searchLower);

    return matchesInterest && matchesSearchText;
  });
};
