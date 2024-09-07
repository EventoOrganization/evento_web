import { useEventStore } from "@/store/useEventStore";

export const setEventField = (key: string, value: any) => {
  const eventStore = useEventStore.getState();
  eventStore.setEventField(key, value);
};

export const clearEventForm = () => {
  const eventStore = useEventStore.getState();
  eventStore.clearEventForm();
};
export const handleFieldChange = (key: string, value: any, index?: number) => {
  useEventStore.setState((state) => {
    if (key === "timeSlots" && index !== undefined) {
      const updatedTimeSlots = [...state.timeSlots];
      updatedTimeSlots[index] = { ...updatedTimeSlots[index], ...value };
      return { timeSlots: updatedTimeSlots };
    } else {
      return { [key]: value };
    }
  });
};
