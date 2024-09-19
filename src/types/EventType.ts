import { TempUserType, UserType } from "./UserType";

// src/types/EventType.ts
export type TimeSlotType = {
  date: string;
  startTime: string;
  endTime: string;
};

export type InterestType = {
  _id?: string;
  name?: string;
  value?: string;
  label?: string;
  __v?: number;
  updatedAt?: string;
  image?: string;
};
export type OptionType = {
  _id: string;
  name: string;
  image?: string;
};
export type QuestionType = {
  id: string;
  question: string;
  type: "text" | "multiple-choice" | "checkbox";
  options?: string[];
  required: boolean;
};

export type EventType = {
  initialMedia: [
    {
      url: string;
      type: string;
    },
  ];
  username?: string;
  _id: string;
  title: string;
  user: UserType;
  eventType: "public" | "private";
  name: string;
  mode: "virtual" | "in-person" | "both";
  date: string;
  endDate?: string;
  event: EventType;
  startTime: string;
  endTime: string;
  description: string;
  includeChat: boolean;
  createRSVP: boolean;
  latitude?: string;
  longitude?: string;
  location?: string;
  coHosts?: UserType[];
  guests?: UserType[];
  tempGuests?: TempUserType[];
  coHostStatus?: boolean;
  isAdmin?: boolean;
  guestsCohostAdd?: UserType[];
  timeSlots: TimeSlotType[];
  privateEventLink?: string;
  interests?: InterestType[];
  imagePreviews?: string[];
  videoPreview?: string;
  attendees?: UserType[];
  favouritees?: UserType[];
  questions?: QuestionType[];
  guestsAllowFriend: boolean;
  additionalField?: any;
  details?: EventDetailsType;
  isGoing?: boolean;
  isHosted?: boolean;
  isFavourite?: boolean;
  isRefused?: boolean;
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
    coordinates: [number, number];
  };
  mode: "virtual" | "in-person" | "both";
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
