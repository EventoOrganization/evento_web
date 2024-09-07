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
  selectedDate: string,
  selectedTab: string,
  location: Location | null,
  distanceFilter: number,
) => {
  const searchLower = searchText.toLowerCase();
  return events.filter((event) => {
    const matchesInterest =
      selectedInterests.length === 0 ||
      selectedInterests.some((selectedInterest) => {
        return (
          event.interest?.some((interest) => {
            return interest._id === selectedInterest._id;
          }) ?? false
        );
      });

    const matchesSearchText =
      event.title?.toLowerCase().includes(searchLower) ||
      event.details?.description?.toLowerCase().includes(searchLower);

    const eventDate = event.details?.date ? new Date(event.details.date) : null;
    const eventEndDate = event.details?.endDate
      ? new Date(event.details.endDate)
      : null;
    const selectedDateObj = selectedDate ? new Date(selectedDate) : null;

    const matchesDate =
      !selectedDateObj ||
      (eventDate &&
        eventEndDate &&
        selectedDateObj >=
          new Date(
            eventDate.getTime() + eventDate.getTimezoneOffset() * 60000,
          ) &&
        selectedDateObj <=
          new Date(
            eventEndDate.getTime() + eventEndDate.getTimezoneOffset() * 60000,
          ));

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
export const filterUsers = (
  users: UserType[],
  selectedInterests: InterestType[],
  searchText: string,
  allInterests: InterestType[],
) => {
  const searchLower = searchText.toLowerCase();

  return users.filter((user) => {
    const userInterests = user.interest
      ? (user.interest
          .map(
            (interestId) =>
              allInterests.find((interest) => interest._id === interestId) ||
              null,
          )
          .filter(Boolean) as InterestType[])
      : [];
    const matchesInterest =
      selectedInterests.length === 0 ||
      selectedInterests.some((interest) =>
        userInterests.some((userInterest) => userInterest._id === interest._id),
      );

    const userName =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || user.lastName || "";

    const matchesSearchText = userName.toLowerCase().includes(searchLower);

    return matchesInterest && matchesSearchText;
  });
};
