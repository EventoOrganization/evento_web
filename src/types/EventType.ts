import { ConversationType } from "@/app/(views)/(dev)/chats/types";
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
export type Announcement = {
  _id: string;
  eventId: string;
  senderId: string;
  message: string;
  type: "info" | "questionnaire";
  receivers: {
    userIds?: string[];
    status?: "going" | "invited" | "decline";
  };
  questions: QuestionType[];
  responses: AnnouncementResponseType[];
  comments: {
    _id: string;
    userId: string;
    content: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
};
export type AnnouncementAnswer = {
  questionId: string;
  answer: string | string[]; // dépend du type de la question
};

export type AnnouncementResponseType = {
  _id: string;
  announcementId: string;
  eventId: string;
  userId: string; // ou UserType si tu veux peupler les infos user
  answers: AnnouncementAnswer[];
  createdAt: string;
  updatedAt: string;
};

export type QuestionType = {
  _id?: string;
  question: string;
  type: "text" | "multiple-choice" | "checkbox";
  options?: string[];
  required?: boolean;
  displayType?: "radio" | "checkbox";
};

export type EventType = {
  initialMedia: [
    {
      url: string;
      type: string;
    },
  ];
  allUploadPhotoVideo?: boolean;
  username?: string;
  _id: string;
  postEventMedia?: [
    {
      url: string;
      type: string;
    },
  ];
  limitedGuests?: number | null;
  hiddenByUsers?: string[];
  title: string;
  user: UserType;
  eventType: "public" | "private";
  name: string;
  googleSheetUrl?: string;
  mode: "virtual" | "in-person" | "both";
  date: string;
  endDate?: string;
  event: EventType;
  startTime: string;
  endTime: string;
  description: string;
  includeChat: boolean;
  createRSVP: boolean;
  restricted?: boolean;
  visibility?: boolean;
  showUsersLists?: boolean;
  latitude?: string;
  longitude?: string;
  location?: string;
  conversation?: ConversationType;
  requested?: UserType[];
  coHosts?: UserType[];
  guests?: UserType[];
  tempGuests?: TempUserType[];
  coHostStatus?: boolean;
  isAdmin?: boolean;
  announcements?: Announcement[];
  guestsCohostAdd?: UserType[];
  timeSlots: TimeSlotType[];
  privateEventLink?: string;
  interests?: InterestType[];
  imagePreviews?: string[];
  videoPreview?: string;
  attendees?: UserType[];
  favouritees?: UserType[];
  refused?: UserType[];
  questions?: QuestionType[];
  guestsAllowFriend?: boolean;
  additionalField?: any;
  details?: EventDetailsType;
  isGoing?: boolean;
  isHosted?: boolean;
  isFavourite?: boolean;
  isRefused?: boolean;
  requiresApproval?: boolean;
  approvedUserIds?: string[];
  eventComments?: CommentType[];
};
export type ReactionType = "like" | "love" | "laugh" | "angry" | "sad";

export type Reaction = {
  userId: string;
  type: ReactionType;
};

// Type principal d’un commentaire
export type CommentType = {
  _id: string;
  eventId: string;
  userId: {
    _id: string;
    username: string;
    profileImage?: string;
  };
  content: string;
  parentId?: string | null;
  depth: number;
  isDeleted: boolean;
  reactions: Reaction[];
  createdAt: string;
  updatedAt: string;
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
  timeZone?: string;
  timeSlots?: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
  description?: string;
  includeChat?: boolean;
  guestsAllowFriend?: boolean;
  createRSVP?: boolean;
  tages?: string;
  URLlink?: string;
  URLtitle?: string;
};
export const getMediaType = (mimeType: string): "image" | "video" => {
  return mimeType.startsWith("video/") ? "video" : "image";
};
export type EventFormValuesType = {
  title: string;
  eventType: "public" | "private";
  username: string;
  date: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timeZone: string;
  description: string;
  mode: "virtual" | "in-person" | "both";
  limitedGuests: number | null;
  location: string;
  latitude: string;
  medias: any[];
  longitude: string;
  timeSlots: TimeSlotType[];
  coHosts: UserType[];
  restricted: boolean;
  createRSVP: boolean;
  questions: QuestionType[];
  additionalField: any[];
  includeChat: boolean;
  UrlLink: string;
  UrlTitle: string;
  uploadedMedia: { images: string[]; videos: string[] };
  predefinedMedia: { images: string[]; videos: string[] };
  interests: InterestType[];
  requiresApproval: boolean;
};
