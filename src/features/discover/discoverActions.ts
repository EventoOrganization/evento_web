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
) => {
  const searchLower = searchText.toLowerCase();
  return events.filter((event) => {
    const matchesInterest =
      selectedInterests.length === 0 ||
      selectedInterests.some((selectedInterest) => {
        return (
          event.interests?.some((interest) => {
            return interest._id === selectedInterest._id;
          }) ?? false
        );
      });
    const matchesTextOrLocation =
      event.user?.username?.toLowerCase().includes(searchLower) ||
      event.title?.toLowerCase().includes(searchLower) ||
      event.details?.description?.toLowerCase().includes(searchLower) ||
      (searchText &&
        event.details?.location?.toLowerCase().includes(searchLower));

    const eventStartDate = event.details?.date
      ? new Date(event.details.date)
      : null;
    const eventEndDate = event.details?.endDate
      ? new Date(event.details.endDate)
      : null;

    const startDay = startDate
      ? new Date(startDate).setHours(0, 0, 0, 0)
      : null;
    const endDay = endDate ? new Date(endDate).setHours(0, 0, 0, 0) : startDay;

    const eventStartDay = eventStartDate
      ? eventStartDate.setHours(0, 0, 0, 0)
      : null;
    const eventEndDay = eventEndDate
      ? eventEndDate.setHours(0, 0, 0, 0)
      : eventStartDay;

    const matchesDate =
      !startDay ||
      !eventStartDay ||
      !eventEndDay ||
      (typeof eventStartDay === "number" &&
        typeof eventEndDay === "number" &&
        typeof startDay === "number" &&
        typeof endDay === "number" &&
        eventStartDay <= endDay &&
        eventEndDay >= startDay);
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
};
export const filterUsers = (
  users: UserType[],
  selectedInterests: InterestType[],
  searchText: string,
): UserType[] => {
  const searchLower = searchText.toLowerCase();

  return users.filter((user) => {
    // Vérifie si l'utilisateur correspond aux intérêts sélectionnés
    const matchesInterests =
      selectedInterests.length === 0 ||
      (user.interests &&
        user.interests.some((interestId) =>
          selectedInterests.some(
            (selectedInterest) => selectedInterest._id === interestId,
          ),
        ));

    // Vérifie si l'utilisateur correspond au texte de recherche
    const matchesSearchText =
      user.username.toLowerCase().includes(searchLower) ||
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower);

    // Inclut l'utilisateur uniquement s'il correspond à l'un des critères
    return matchesInterests || matchesSearchText;
  });
};
