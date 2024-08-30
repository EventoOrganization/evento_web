"use client";
import Section from "@/components/layout/Section";
import Showcase from "@/components/Showcase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDiscoverContext } from "@/contexts/DiscoverContext";
import LocationSelector from "@/features/discover/LocationSelector";
import TabSelector from "@/features/discover/TabSelector";
import Event from "@/features/event/components/Event";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Location {
  lat: number;
  lng: number;
}

// Fonction pour calculer la distance entre deux points (en km)
const getDistanceFromLatLonInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon1 - lon2) * (Math.PI / 180); // Attention, inversion des ordres
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

const DiscoverPage = () => {
  const { interests, events, users } = useDiscoverContext();

  // State for filters
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [selectedTab, setSelectedTab] = useState("All");
  const [location, setLocation] = useState<Location | null>(null);
  const [distanceFilter, setDistanceFilter] = useState(10); // Default distance in km

  // Log initial states
  console.log("Initial events:", events);
  console.log("Selected location:", location);

  // Filter events based on date, selected tab, and location
  useEffect(() => {
    console.log("Filtering events...");
    const filtered = events.filter((event) => {
      const matchesDate = !selectedDate || event.details?.date === selectedDate;

      const isNearMe =
        selectedTab === "Near me" &&
        location &&
        event.details?.loc?.coordinates[0] !== 0 &&
        getDistanceFromLatLonInKm(
          location.lat,
          location.lng,
          event.details?.loc?.coordinates[1] || 0, // Latitude
          event.details?.loc?.coordinates[0] || 0, // Longitude
        ) <= distanceFilter;

      const isVirtual =
        selectedTab === "Virtual" && event.details?.mode === "virtual";

      const matchesTab = selectedTab === "All" || isNearMe || isVirtual;

      console.log(
        "Event:",
        event.title,
        "matchesDate:",
        matchesDate,
        "matchesTab:",
        matchesTab,
      );
      return matchesDate && matchesTab;
    });
    console.log("Filtered events:", filtered);
    setFilteredEvents(filtered);
  }, [selectedDate, selectedTab, events, location, distanceFilter]);

  // Filter users based on interests and search text
  useEffect(() => {
    console.log("Filtering users...");
    const filtered = users.filter((user) => {
      const matchesInterest =
        selectedInterests.length === 0 ||
        selectedInterests.some((interest: any) =>
          user.interests?.includes(interest),
        );
      const matchesSearchText = user.name
        ? user.name.toLowerCase().includes(searchText.toLowerCase())
        : false;

      console.log(
        "matchesInterest:",
        matchesInterest,
        "matchesSearchText:",
        matchesSearchText,
      );
      return matchesInterest && matchesSearchText;
    });
    console.log("Filtered users:", filtered);
    setFilteredUsers(filtered);
  }, [selectedInterests, searchText, users]);

  const handleInterestToggle = (interest: string) => {
    console.log("Toggling interest:", interest);
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  return (
    <>
      <Section className="grid grid-cols-2 gap-4 items-start">
        <ul>
          {/* Utiliser le TabSelector pour sélectionner le filtre */}
          <TabSelector onChange={setSelectedTab} />
          {filteredEvents &&
            filteredEvents.map((event) => (
              <li key={event._id}>
                <Event event={event} />
              </li>
            ))}
        </ul>
        <div>
          <LocationSelector onLocationChange={setLocation} />
          <Input
            type="text"
            placeholder="Search users"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Label className="bg-red-500">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Label>
          {selectedTab === "Near me" && (
            <div>
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
          <ul className="flex flex-wrap gap-4 mt-4">
            {interests &&
              interests.map((interest) => (
                <li
                  key={interest._id}
                  onClick={() => handleInterestToggle(interest.name)}
                  className={cn(
                    "cursor-pointer bg-gray-200 rounded px-2 py-1 w-fit hover:bg-eventoPurpleLight/50 focus:border-eventoBlue",
                    {
                      "bg-eventoPurpleLight/40": selectedInterests.includes(
                        interest.name,
                      ),
                    },
                  )}
                >
                  {interest.name}
                </li>
              ))}
          </ul>
          <Showcase
            users={filteredUsers.length > 0 ? filteredUsers : users}
            className="flex-row flex-wrap"
            itemClassName="flex w-full justify-between"
          />
        </div>
      </Section>
    </>
  );
};

export default DiscoverPage;
