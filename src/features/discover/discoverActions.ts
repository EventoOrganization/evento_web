import { EventType, InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
interface Location {
  lat: number;
  lng: number;
}

export const getDistanceFromLatLonInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon1 - lon2) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};
export const filterEvents = (
  events: EventType[],
  selectedInterests: InterestType[],
  searchText: string,
  selectedTab: string,
  location: Location | null,
  startDate: Date | null,
  endDate: Date | null,
): EventType[] => {
  console.log("FILTERING EVENTS");
  const getUTCDate = (date: Date) => {
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
  };
  // Dates de référence définies UNE SEULE FOIS
  const today = getUTCDate(new Date());
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(today.getUTCDate() + 1);

  const afterTomorrow = new Date(today);
  afterTomorrow.setUTCDate(today.getUTCDate() + 2);

  const nextWeek = new Date(today);
  nextWeek.setUTCDate(today.getUTCDate() + 7);

  const searchLower = searchText.toLowerCase();

  // Filtrage des événements
  const filteredEvents = events.filter((event) => {
    // Vérifie les intérêts
    const matchesInterest =
      selectedInterests.length === 0 ||
      selectedInterests.some((selectedInterest) =>
        event.interests?.some(
          (interest) => interest._id === selectedInterest._id,
        ),
      );

    // Vérifie si le texte de recherche correspond
    const matchesTextOrLocation =
      event.user?.username?.toLowerCase().includes(searchLower) ||
      event.coHosts?.some((coHost) =>
        coHost?.username?.toLowerCase().includes(searchLower),
      ) ||
      event.attendees?.some((attendee) =>
        attendee?.username?.toLowerCase().includes(searchLower),
      ) ||
      event.title?.toLowerCase().includes(searchLower) ||
      event.details?.description?.toLowerCase().includes(searchLower) ||
      (searchText &&
        event.details?.location?.toLowerCase().includes(searchLower));

    // Dates de l'événement
    const eventStartDate = event.details?.date
      ? new Date(event.details.date).getTime()
      : null;
    const eventEndDate = event.details?.endDate
      ? new Date(event.details.endDate).getTime()
      : eventStartDate;

    // Vérifie les dates
    const startDay = startDate ? startDate.setHours(0, 0, 0, 0) : null;
    const endDay = endDate ? endDate.setHours(0, 0, 0, 0) : startDay;

    const matchesDate =
      !startDay ||
      !eventStartDate ||
      !eventEndDate ||
      (endDay !== null &&
        eventStartDate <= endDay + 24 * 60 * 60 * 1000 &&
        eventEndDate >= startDay);

    // Vérifie le type d'événement (proche, virtuel)
    const isNearMe =
      selectedTab === "Near me" &&
      location &&
      getDistanceFromLatLonInKm(
        location.lat,
        location.lng,
        event.details?.loc?.coordinates[1] || 0,
        event.details?.loc?.coordinates[0] || 0,
      ) < 10;

    const isVirtual =
      selectedTab === "Virtual" &&
      event.details?.mode !== undefined &&
      (event.details.mode === "virtual" || event.details.mode === "both");

    const matchesTab = selectedTab === "All events" || isNearMe || isVirtual;

    return (
      matchesInterest && matchesTextOrLocation && matchesDate && matchesTab
    );
  });

  // Tri des événements
  const sortedEvents = filteredEvents.sort((a, b) => {
    const aStartDate = getUTCDate(new Date(a.details?.date ?? "")).getTime();
    const bStartDate = getUTCDate(new Date(b.details?.date ?? "")).getTime();

    const isAStartingToday = aStartDate === today.getTime();
    const isBStartingToday = bStartDate === today.getTime();
    const isAStartingTomorrow = aStartDate === tomorrow.getTime();
    const isBStartingTomorrow = bStartDate === tomorrow.getTime();
    const isAStartingAfterTomorrow = aStartDate === afterTomorrow.getTime();
    const isBStartingAfterTomorrow = bStartDate === afterTomorrow.getTime();
    const isAStartingThisWeek =
      aStartDate > afterTomorrow.getTime() && aStartDate <= nextWeek.getTime();
    const isBStartingThisWeek =
      bStartDate > afterTomorrow.getTime() && bStartDate <= nextWeek.getTime();

    const isAActiveToday =
      new Date(a.details?.date ?? "").getTime() < today.getTime() &&
      new Date(a.details?.endDate ?? "").getTime() >= today.getTime();
    const isBActiveToday =
      new Date(b.details?.date ?? "").getTime() < today.getTime() &&
      new Date(b.details?.endDate ?? "").getTime() >= today.getTime();

    // **1️⃣ Priorité aux événements qui COMMENCENT et SE TERMINENT aujourd'hui**
    if (isAStartingToday && !isBStartingToday) return -1;
    if (!isAStartingToday && isBStartingToday) return 1;

    // **2️⃣ Ensuite ceux qui commencent demain**
    if (isAStartingTomorrow && !isBStartingTomorrow) return -1;
    if (!isAStartingTomorrow && isBStartingTomorrow) return 1;

    // **3️⃣ Ensuite ceux qui commencent après-demain**
    if (isAStartingAfterTomorrow && !isBStartingAfterTomorrow) return -1;
    if (!isAStartingAfterTomorrow && isBStartingAfterTomorrow) return 1;

    // **4️⃣ Ensuite ceux qui commencent cette semaine**
    if (isAStartingThisWeek && !isBStartingThisWeek) return -1;
    if (!isAStartingThisWeek && isBStartingThisWeek) return 1;

    // **5️⃣ Ensuite les événements "actifs" (qui ont commencé mais pas encore terminés)**
    if (isAActiveToday && !isBActiveToday) return -1;
    if (!isAActiveToday && isBActiveToday) return 1;

    // **6️⃣ Enfin, trier par date de début croissante**
    return aStartDate - bStartDate;
  });

  return sortedEvents;
};

export const filterUsers = (
  users: UserType[],
  selectedInterests: InterestType[],
  searchText: string,
): {
  filteredUsers: UserType[];
  friends: UserType[];
  usersYouMayKnow: UserType[];
  usersWithSharedInterests: UserType[];
  generalSuggestions: UserType[];
} => {
  const searchLower = searchText.toLowerCase();

  // 🔹 **Filtrage principal**
  const filteredUsers = users.filter((user) => {
    if (user.username.toLowerCase() === "anonymous") {
      return false;
    }

    const matchesInterests =
      selectedInterests.length === 0 ||
      (user.interests &&
        user.interests.some((interestId) =>
          selectedInterests.some(
            (selectedInterest) => selectedInterest._id === interestId,
          ),
        ));

    const matchesSearchText =
      !searchText ||
      user.username.toLowerCase().includes(searchLower) ||
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower);

    return matchesInterests && matchesSearchText;
  });

  // 🔹 **Catégories de filtrage**
  return {
    filteredUsers,
    friends: filteredUsers.filter(
      (user) => user.isIFollowingHim && user.isFollowingMe,
    ),
    usersYouMayKnow: filteredUsers.filter(
      (user) => !user.isIFollowingHim && user.isFollowingMe,
    ),
    usersWithSharedInterests: filteredUsers.filter(
      (user) =>
        user.matchingInterests &&
        user.matchingInterests > 0 &&
        !user.isIFollowingHim,
    ),
    generalSuggestions: filteredUsers.filter(
      (user) =>
        !user.isIFollowingHim &&
        !user.isFollowingMe &&
        (!user.matchingInterests || user.matchingInterests === 0),
    ),
  };
};
