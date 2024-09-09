import { EventType, InterestType } from "./EventType";

export type UserType = {
  _id: string;
  name: string;
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
