import { EventType, InterestType } from "./EventType";
import { PwaSubscriptionType } from "./PwaSubscriptionType";

export type UserType = {
  _id: string;
  username: string;
  status?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  URL?: string;
  countryCode?: string;
  createdAt?: string;
  updatedAt?: string;
  token?: string;
  profileImage?: string;
  eventsAttended?: number;
  matchingInterests?: number;
  followingUserIds?: string[];
  pwaSubscriptions?: PwaSubscriptionType[];
  followerUserIds?: string[];
  following?: number;
  isFollowingMe?: boolean;
  isIFollowingHim?: boolean;
  upcomingEvents?: EventType[];
  filteredUpcomingEventsAttened?: EventType[];
  filteredPastEventsAttended?: EventType[];
  pastEvents?: EventType[];
  hostedEvents?: EventType[];
  totalEventAttended?: number;
  interests?: InterestType[];
  interest?: InterestType[];
  aboutMe?: string;
  bio?: string;
  DOB?: string;
  phoneNumber?: string;
  socialId?: string;
  socialType?: number;
  password?: string;
  address?: string;
  role?: "admin" | "user";
  deviceToken?: string;
  deviceType?: string;
  otp?: number;
  socialLinks?: { platform: string; url: string }[];
  phone_verified?: string;
  is_block?: number;
  is_otp_verify?: number;
  countTotalEventIAttended?: number;
  countFollowing?: number;
  rsvpSubmission?: RSVPSubmissionType;
  refusedReason?: string;
};

export type TempUserType = {
  _id?: string;
  username: string;
  status?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  URL?: string;
  countryCode?: string;
  createdAt?: string;
  updatedAt?: string;
  token?: string;
  profileImage?: string;
  eventsAttended?: number;
  following?: number;
  upcomingEvents?: EventType[];
  filteredUpcomingEventsAttened?: EventType[];
  filteredPastEventsAttended?: EventType[];
  pastEvents?: EventType[];
  totalEventAttended?: number;
  interests?: InterestType[];
  interest?: InterestType[];
  aboutMe?: string;
  bio?: string;
  DOB?: string;
  phoneNumber?: string;
  socialId?: string;
  socialType?: number;
  password?: string;
  address?: string;
  role?: "admin" | "user";
  deviceToken?: string;
  deviceType?: string;
  otp?: number;
  socialLinks?: { platform: string; url: string }[];
  phone_verified?: string;
  is_block?: number;
  is_otp_verify?: number;
  countTotalEventIAttended?: number;
  countFollowing?: number;
};
interface RSVPAnswerType {
  _id: string;
  answer: string[];
}

interface AdditionalFieldAnswerType {
  name?: string;
  value?: string;
}

interface RSVPSubmissionType {
  _id: string;
  eventId: string;
  userId: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    profileImage: string;
  };
  rsvpAnswers: RSVPAnswerType[];
  additionalFieldAnswers: AdditionalFieldAnswerType[];
  createdAt: string;
  updatedAt: string;
}
