import { useProfileStore } from "@/store/useProfileStore";
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
  users: UserType[],
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

  const sortedEvents = filteredEvents.sort((a, b) => {
    const aStartDate = getUTCDate(new Date(a.details?.date ?? "")).getTime();
    const bStartDate = getUTCDate(new Date(b.details?.date ?? "")).getTime();

    const friends = users.filter(
      (user) => user.isIFollowingHim && user.isFollowingMe,
    );
    const profileInterests = useProfileStore.getState().userInfo?.interests;
    // **1️⃣ Vérifie si les événements sont "Near Me"**
    const isANearMe =
      location &&
      getDistanceFromLatLonInKm(
        location.lat,
        location.lng,
        a.details?.loc?.coordinates[1] || 0,
        a.details?.loc?.coordinates[0] || 0,
      ) < 10;

    const isBNearMe =
      location &&
      getDistanceFromLatLonInKm(
        location.lat,
        location.lng,
        b.details?.loc?.coordinates[1] || 0,
        b.details?.loc?.coordinates[0] || 0,
      ) < 10;

    // **2️⃣ Vérifie si des amis participent**
    const aFriendsGoing = a.attendees?.some((attendee) =>
      friends.some((friend) => friend._id === attendee._id),
    );

    const bFriendsGoing = b.attendees?.some((attendee) =>
      friends.some((friend) => friend._id === attendee._id),
    );

    // **3️⃣ Vérifie les intérêts communs**
    const aMatchingInterests =
      a.interests?.filter((interest) =>
        profileInterests?.some(
          (profileInterest) => profileInterest._id === interest._id,
        ),
      ).length || 0;

    const bMatchingInterests =
      b.interests?.filter((interest) =>
        profileInterests?.some(
          (profileInterest) => profileInterest._id === interest._id,
        ),
      ).length || 0;

    // 🔥 **1️⃣ Priorité aux événements "Near Me"**
    if (isANearMe && !isBNearMe) return -1;
    if (!isANearMe && isBNearMe) return 1;

    // 🔥 **2️⃣ Priorité aux événements avec des intérêts communs**
    if (aMatchingInterests > bMatchingInterests) return -1;
    if (aMatchingInterests < bMatchingInterests) return 1;

    // 🔥 **3️⃣ Priorité aux événements avec des amis participants**
    if (aFriendsGoing && !bFriendsGoing) return -1;
    if (!aFriendsGoing && bFriendsGoing) return 1;

    // 🔥 **4️⃣ Finalement, tri par date croissante**
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
