import { useCreateEventStore } from "@/store/useCreateEventStore";
import { EventType } from "@/types/EventType";
import { UserType } from "@/types/UserType";

export const setEventField = (key: string, value: any) => {
  const eventStore = useCreateEventStore.getState();
  eventStore.setEventField(key, value);
};

export const clearEventForm = () => {
  const eventStore = useCreateEventStore.getState();
  eventStore.clearEventForm();
};
export const handleFieldChange = (key: string, value: any, index?: number) => {
  useCreateEventStore.setState((state) => {
    if (key === "timeSlots" && index !== undefined) {
      const updatedTimeSlots = [...state.timeSlots];
      updatedTimeSlots[index] = { ...updatedTimeSlots[index], ...value };
      return { timeSlots: updatedTimeSlots };
    } else if (key === "mediaPreviews") {
      const updatedMediaPreviews = Array.isArray(state.mediaPreviews)
        ? [...state.mediaPreviews, ...value]
        : [...value];
      return { mediaPreviews: updatedMediaPreviews };
    } else {
      return { [key]: value };
    }
  });
};

export const formatDateToEuropean = (date: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  return new Date(date).toLocaleDateString("en-UK", options); // "fr-FR" est pour le format européen
};
export const hasEventhost = (event: EventType, user: UserType) => {
  if (!event || !user) return false;
  return event.user._id === user._id;
};
export const isApproved = (event: EventType, user: UserType) => {
  const isApproved =
    !!event &&
    !!user &&
    (!event.requiresApproval ||
      isAdmin(event, user) ||
      (event.approvedUserIds ?? []).includes(user._id));
  return isApproved;
};

export const isAdmin = (event: EventType, user: UserType) => {
  if (!event || !user) return false;
  const isHost = user?._id === event.user?._id;
  const isCoHost = user
    ? (event.coHosts?.some((coHost) => coHost.userId?._id === user._id) ??
      false)
    : false;
  const isAdmin = isHost || isCoHost;
  return isAdmin;
};
