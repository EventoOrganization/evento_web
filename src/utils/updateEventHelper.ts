// src/utils/updateEventHelper.ts

import { EventType } from "@/types/EventType";

/**
 * Fonction pour mettre à jour un champ spécifique d'un événement.
 * @param event - L'événement à mettre à jour
 * @param field - Le champ à mettre à jour
 * @param value - La nouvelle valeur pour le champ
 * @returns EventType - L'événement mis à jour
 */
export function createUpdateEventField(event: EventType) {
  return (field: string, value: any): EventType => {
    const updatedEvent = {
      ...event,
      details: { ...event.details, mode: event.details?.mode || "virtual" },
    };

    // Logique de mise à jour comme précédemment
    switch (field) {
      case "title":
        updatedEvent.title = value;
        break;
      case "locationData":
        updatedEvent.details.location = value.location;
        break;
      case "description":
        updatedEvent.details.description = value;
        break;
      case "interests":
        if (Array.isArray(value)) {
          updatedEvent.interests = value;
        }
        break;
      case "type":
        if (value === "public" || value === "private") {
          updatedEvent.eventType = value;
        }
        break;
      case "mode":
        if (["virtual", "in-person", "both"].includes(value)) {
          updatedEvent.details.mode = value;
        }
        break;
      case "url":
        updatedEvent.details.URLlink = value || "";
        break;
      case "createRSVP":
        updatedEvent.details.createRSVP = value;
        break;
      case "questions":
        updatedEvent.questions = value.map((question: any) => ({
          id: question.id || new Date().getTime().toString(),
          question: question.question || "",
          type: question.type || "text",
          options: question.options || [],
          required: question.required || false,
        }));
        break;
      case "date":
        updatedEvent.details.date = value.startDate;
        updatedEvent.details.endDate = value.endDate;
        updatedEvent.details.startTime = value.startTime;
        updatedEvent.details.endTime = value.endTime;
        if (Array.isArray(value.timeSlots)) {
          updatedEvent.details.timeSlots = value.timeSlots.map((slot: any) => ({
            date: slot.date || "",
            startTime: slot.startTime || "08:00",
            endTime: slot.endTime || "18:00",
          }));
        }
        break;
      default:
        console.warn("Unknown field", field);
    }

    return updatedEvent;
  };
}
