import { useEventStore } from "@/store/useEventStore";

// Fonction pour mettre à jour un champ dans le store
export const setEventField = (key: string, value: any) => {
  const eventStore = useEventStore.getState();
  eventStore.setEventField(key, value);
};

// Fonction pour réinitialiser le formulaire d'événement
export const clearEventForm = () => {
  const eventStore = useEventStore.getState();
  eventStore.clearEventForm();
};
export const handleFieldChange = (key: string, value: any) => {
  setEventField(key, value);
};
