// src/types/EventType.ts
export type TimeSlot = {
  date: string;
  startTime: string;
  endTime: string;
};

export type Interest = {
  _id: string;
  name: string;
  value: string;
  label: string;
};
export type Option = {
  value: string;
  label: string;
};
export type Question = {
  id: string;
  question: string;
  answer: string;
  required: boolean;
  options?: string[];
  type: "text" | "multiple-choice" | "checkbox"; // Ajout du type ici
};

export type Event = {
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
  interests?: Interest[];
  timeSlots: TimeSlot[];
  privateEventLink?: string;
  imagePreviews?: string[];
  videoPreview?: string;
  questions?: {
    question: string;
    answer: string;
    required: boolean;
    options?: string[];
  }[];
  guestsAllowFriend: boolean;
  additionalField?: any;
};
export type EventDetails = {
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
