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
// Fonction pour uploader les fichiers images/vidéos
export const handleFileUpload = (files: FileList) => {
  const eventStore = useEventStore.getState();

  Array.from(files).forEach((file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (file.type.startsWith("image/")) {
        eventStore.setEventField("images", [
          ...(eventStore.images || []),
          result,
        ]);
      } else if (file.type.startsWith("video/")) {
        eventStore.setEventField("video", result);
      }
    };
    reader.readAsDataURL(file);
  });
};
