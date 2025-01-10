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
  const todayMidnight = new Date().setHours(0, 0, 0, 0);
  const tomorrowMidnight = todayMidnight + 24 * 60 * 60 * 1000; // +1 jour
  const nextWeekMidnight = todayMidnight + 7 * 24 * 60 * 60 * 1000; // +7 jours
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

    // Vérifie si le texte de recherche correspond (titre, description, lieu, utilisateur, etc.)
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
      (endDay !== null && eventStartDate <= endDay && eventEndDate >= startDay);

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
    const aStartDate = a.details?.date
      ? new Date(a.details.date).getTime()
      : Infinity;
    const aEndDate = a.details?.endDate
      ? new Date(a.details.endDate).getTime()
      : aStartDate;

    const bStartDate = b.details?.date
      ? new Date(b.details.date).getTime()
      : Infinity;
    const bEndDate = b.details?.endDate
      ? new Date(b.details.endDate).getTime()
      : bStartDate;

    const aMidpoint = (aStartDate + aEndDate) / 2;
    const bMidpoint = (bStartDate + bEndDate) / 2;

    // Classement par priorité
    if (aStartDate <= todayMidnight && aEndDate >= todayMidnight) {
      return -1; // Événements aujourd'hui
    }
    if (bStartDate <= todayMidnight && bEndDate >= todayMidnight) {
      return 1;
    }
    if (aStartDate <= tomorrowMidnight && aEndDate >= tomorrowMidnight) {
      return -1; // Événements demain
    }
    if (bStartDate <= tomorrowMidnight && bEndDate >= tomorrowMidnight) {
      return 1;
    }
    if (aStartDate <= nextWeekMidnight && aEndDate >= nextWeekMidnight) {
      return -1; // Événements cette semaine
    }
    if (bStartDate <= nextWeekMidnight && bEndDate >= nextWeekMidnight) {
      return 1;
    }

    // Sinon, trier par la moyenne des dates
    return aMidpoint - bMidpoint;
  });

  return sortedEvents;
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
