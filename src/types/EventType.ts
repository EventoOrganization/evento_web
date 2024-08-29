import { Question } from "@/store/useEventStore";

// src/types/EventType.ts
export type TimeSlotType = {
  date: string;
  startTime: string;
  endTime: string;
};

export type InterestType = {
  _id: string;
  name: string;
  value: string;
  label: string;
};
export type OptionType = {
  value: string;
  label: string;
};

export type EventType = {
  _id: string;
  title: string;
  eventType: "public" | "private";
  name: string;
  mode: "virtual" | "in-person";
  date: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  description: string;
  includeChat: boolean;
  createRSVP: boolean;
  latitude?: string;
  longitude?: string;
  location?: string;
  coHosts?: string[];
  guests?: string[];
  interestId?: string[];
  interests?: InterestType[];
  timeSlots: TimeSlotType[];
  privateEventLink?: string;
  imagePreviews?: string[];
  videoPreview?: string;
  questions?: Question[];
  guestsAllowFriend: boolean;
  additionalField?: any;
  details?: EventDetailsType;
};
export type FileType = {
  name: string;
  size: number;
  type: string;
  lastModified: number;
};
export type EventDetailsType = {
  name?: string;
  video?: string;
  thumbnailVideo?: string;
  images?: string[];
  loc?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  mode?: "virtual" | "in-person";
  location?: string;
  longitude?: string;
  latitude?: string;
  date?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  timeSlots?: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
  description?: string;
  includeChat?: boolean;
  createRSVP?: boolean;
  tages?: string;
  URLlink?: string;
};
