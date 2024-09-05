"use client";
import { useSession } from "@/contexts/SessionProvider";
import { UserType } from "@/types/UserType";
import { fetchData } from "@/utils/fetchData";
import { useEffect } from "react";

interface Location {
  lat: number;
  lng: number;
}

const DiscoverPage = () => {
  //Filters
  // const { interests, events } = useDiscoverContext();
  // const [selectedInterests, setSelectedInterests] = useState<InterestType[]>(
  //   [],
  // );
  // const [searchText, setSearchText] = useState("");
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // const [selectedTab, setSelectedTab] = useState("All");
  // const [location, setLocation] = useState<Location | null>(null);
  // const [distanceFilter, setDistanceFilter] = useState(10);
  // const [users, setUsers] = useState<UserType[]>([]);
  // displayedDatas
  // const [filteredEvents, setFilteredEvents] = useState(events);
  // const [filteredUsers, setFilteredUsers] = useState([] as UserType[]);
  const { user: loggedUser } = useSession();
  // const handleInterestToggle = (interest: InterestType) => {
  //   setSelectedInterests((prev) =>
  //     prev.some((i) => i._id === interest._id)
  //       ? prev.filter((i) => i._id !== interest._id)
  //       : [...prev, interest],
  //   );
  // };
  const fetchUsers = async () => {
    const endPoint = loggedUser
      ? `/users/followStatusForUsersYouFollow/${loggedUser?._id}`
      : "/users/allUserListing";

    try {
      const response = await fetchData(endPoint);
      if (loggedUser) {
        const usersWithStatus = (
          response as { user: UserType; status: string }[]
        ).map((item) => ({
          ...item.user,
          status: item.status,
        }));
        // setUsers(usersWithStatus);
        console.log(usersWithStatus);
      } else {
        const result = response as { allUserListing: UserType[] };
        // setUsers(result.allUserListing);
        console.log(result.allUserListing);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [loggedUser]); // Re-fetch users when loggedUser changes

  // useEffect(() => {
  //   const formattedDate = selectedDate ? selectedDate.toISOString() : "";
  //   if (users && users.length > 0 && events && events.length > 0) {
  //     const filteredEvents = filterEvents(
  //       events,
  //       selectedInterests,
  //       searchText,
  //       formattedDate,
  //       selectedTab,
  //       location,
  //       distanceFilter,
  //     );

  //     const filteredUsers = filterUsers(
  //       users,
  //       selectedInterests,
  //       searchText,
  //       interests,
  //     );

  //     setFilteredEvents(filteredEvents);
  //     setFilteredUsers(filteredUsers);
  //   }
  // }, [
  //   selectedInterests,
  //   searchText,
  //   selectedDate,
  //   selectedTab,
  //   events,
  //   users,
  //   location,
  //   distanceFilter,
  // ]);

  return (
    <>
      {/* <Section className="flex flex-col-reverse md:grid md:grid-cols-2 gap-20 items-start">
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
              {filteredUsers.map((user) => (
                <li key={user._id} className="flex justify-between">
                  <UserPrevirew user={user} fetchUsers={fetchUsers} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section> */}
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
// const filterEvents = (
//   events: EventType[],
//   selectedInterests: InterestType[],
//   searchText: string,
//   selectedDate: string,
//   selectedTab: string,
//   location: Location | null,
//   distanceFilter: number,
// ) => {
//   // console.log("events", events);
//   const searchLower = searchText.toLowerCase();
//   return events.filter((event) => {
//     const matchesInterest =
//       selectedInterests.length === 0 ||
//       selectedInterests.some((selectedInterest) => {
//         return (
//           event.interest?.some((interest) => {
//             return interest._id === selectedInterest._id;
//           }) ?? false
//         );
//       });

//     const matchesSearchText =
//       event.title?.toLowerCase().includes(searchLower) ||
//       event.details?.description?.toLowerCase().includes(searchLower);

//     const eventDate = event.details?.date ? new Date(event.details.date) : null;
//     const eventEndDate = event.details?.endDate
//       ? new Date(event.details.endDate)
//       : null;
//     const selectedDateObj = selectedDate ? new Date(selectedDate) : null;

//     const matchesDate =
//       !selectedDateObj ||
//       (eventDate &&
//         eventEndDate &&
//         selectedDateObj >=
//           new Date(
//             eventDate.getTime() + eventDate.getTimezoneOffset() * 60000,
//           ) &&
//         selectedDateObj <=
//           new Date(
//             eventEndDate.getTime() + eventEndDate.getTimezoneOffset() * 60000,
//           ));

//     const isNearMe =
//       selectedTab === "Near me" &&
//       location &&
//       getDistanceFromLatLonInKm(
//         location.lat,
//         location.lng,
//         event.details?.loc?.coordinates[1] || 0,
//         event.details?.loc?.coordinates[0] || 0,
//       ) <= distanceFilter;

//     const isVirtual =
//       selectedTab === "Virtual" && event.details?.mode === "virtual";

//     const matchesTab = selectedTab === "All" || isNearMe || isVirtual;

//     return matchesInterest && matchesSearchText && matchesDate && matchesTab;
//   });
// };
// // Fonction de filtrage des utilisateurs
// const filterUsers = (
//   users: UserType[],
//   selectedInterests: InterestType[],
//   searchText: string,
//   allInterests: InterestType[], // Liste des intérêts disponibles
// ) => {
//   const searchLower = searchText.toLowerCase();

//   return users.filter((user) => {
//     // Mapping des IDs d'intérêts de l'utilisateur aux objets complets
//     const userInterests = user.interest
//       ?.map(
//         (interestId) =>
//           allInterests.find((interest) => interest._id === interestId) || null,
//       )
//       .filter(Boolean) as InterestType[];

//     // Vérifie les intérêts sélectionnés
//     const matchesInterest =
//       selectedInterests.length === 0 ||
//       selectedInterests.some((interest) =>
//         userInterests.some((userInterest) => userInterest._id === interest._id),
//       );

//     const userName =
//       user.firstName && user.lastName
//         ? `${user.firstName} ${user.lastName}`
//         : user.firstName || user.lastName || "";

//     // Vérifie le texte de recherche
//     const matchesSearchText = userName.toLowerCase().includes(searchLower);

//     return matchesInterest && matchesSearchText;
//   });
// };
