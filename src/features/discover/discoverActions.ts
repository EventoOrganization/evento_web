import { EventType, InterestType } from "@/types/EventType";
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

    const matchesSearchText =
      event.title?.toLowerCase().includes(searchLower) ||
      event.details?.description?.toLowerCase().includes(searchLower);
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

    const matchesTab = selectedTab === "All" || isNearMe || isVirtual;

    return matchesInterest && matchesSearchText && matchesDate && matchesTab;
  });
};
