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
import { UserType } from "@/types/UserType";
import { Label } from "@radix-ui/react-label";
import { Search } from "lucide-react";
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

const DiscoverPage = () => {
  const { interests, events, users } = useDiscoverContext();

  // State pour les filtres
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [selectedTab, setSelectedTab] = useState("All");
  const [location, setLocation] = useState<Location | null>(null);
  const [distanceFilter, setDistanceFilter] = useState(10); // Distance par défaut en km

  // Log des états initiaux
  // console.log("Initial events:", events);
  console.log("initial location:", location);
  // console.log("Users:", users[0]);

  // Filtrer les événements en fonction de la date, l'onglet sélectionné et la localisation
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

  // Filtrer les utilisateurs en fonction des intérêts et du texte de recherche
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
  useEffect(() => {
    console.log("Filtering users and events...");

    const searchLower = searchText.toLowerCase();

    // Filtrer les événements en fonction de plusieurs critères
    const filteredEvents = events.filter((event) => {
      const inTitle = event.title?.toLowerCase().includes(searchLower);

      const inCoHosts = event.coHosts?.some((coHost: UserType) => {
        return (
          coHost.firstName?.toLowerCase().includes(searchLower) ||
          coHost.lastName?.toLowerCase().includes(searchLower)
        );
      });

      const inGuests = event.guests?.some((guest: UserType) => {
        return (
          guest.firstName?.toLowerCase().includes(searchLower) ||
          guest.lastName?.toLowerCase().includes(searchLower)
        );
      });

      const inDetailsName = event.details?.name
        ?.toLowerCase()
        .includes(searchLower);
      const inDescription = event.details?.description
        ?.toLowerCase()
        .includes(searchLower);

      return inTitle || inCoHosts || inGuests || inDetailsName || inDescription;
    });

    // Filtrer les utilisateurs en fonction du prénom et du nom de famille
    const filteredUsers = users.filter((user) => {
      const inFirstName = user.firstName?.toLowerCase().includes(searchLower);
      const inLastName = user.lastName?.toLowerCase().includes(searchLower);

      return inFirstName || inLastName;
    });

    setFilteredEvents(filteredEvents);
    setFilteredUsers(filteredUsers);
  }, [searchText, events, users]);

  return (
    <>
      <Section className="flex flex-col-reverse md:grid md:grid-cols-2  gap-20  items-start">
        <ul className="w-full space-y-6">
          {/* Utiliser le TabSelector pour sélectionner le filtre */}
          <TabSelector onChange={setSelectedTab} />
          {filteredEvents &&
            filteredEvents.map((event) => (
              <li key={event._id}>
                <Event event={event} />
              </li>
            ))}
        </ul>
        <div className="flex flex-col gap-2">
          <LocationSelector onLocationChange={setLocation} />
          <div className="relative flex items-center">
            <Search
              className="w-6 h-6 absolute left-3 text-eventoPurpleDark"
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
          <DateSelector
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
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
          <div>
            <h3>Select Interests</h3>
            <ul className="flex flex-wrap gap-4 mt-4">
              {interests &&
                interests.map((interest) => (
                  <li
                    key={interest._id}
                    onClick={() => handleInterestToggle(interest.name)}
                    className={cn(
                      "cursor-pointer bg-gray-200 rounded px-2 py-1 w-fit hover:bg-eventoPurpleLight/50 focus:border-eventoBlue",
                      {
                        "bg-eventoPurpleLight/20": selectedInterests.includes(
                          interest.name,
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
            users={filteredUsers.length > 0 ? filteredUsers : users}
            className="flex-row flex-wrap"
            itemClassName="w-full justify-between "
          />
        </div>
      </Section>
    </>
  );
};

export default DiscoverPage;
