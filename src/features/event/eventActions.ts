import { useEventStore } from "@/store/useEventStore";

// Fonction pour mettre à jour un champ dans le store
export const setEventField = (key: string, value: any) => {
  const eventStore = useEventStore.getState();
  eventStore.setEventField(key, value);
};
export const isUserLoggedInCSR = (): string | null => {
  // console.log("isUserLoggedInCSR called");
  if (typeof window !== "undefined") {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    // console.log("token", token);
    return token || null;
  }
  return null;
};

// Fonction pour réinitialiser le formulaire d'événement
export const clearEventForm = () => {
  const eventStore = useEventStore.getState();
  eventStore.clearEventForm();
};
export const handleFieldChange = (key: string, value: any, index?: number) => {
  useEventStore.setState((state) => {
    // Vérifiez si la clé est 'timeSlots' et qu'un index est fourni
    if (key === "timeSlots" && index !== undefined) {
      // Mettez à jour le timeslot spécifique
      const updatedTimeSlots = [...state.timeSlots];
      updatedTimeSlots[index] = { ...updatedTimeSlots[index], ...value };
      return { timeSlots: updatedTimeSlots };
    } else {
      // Sinon, mettez à jour le champ normal
      return { [key]: value };
    }
  });
};
