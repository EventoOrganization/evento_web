import { EventType } from "react-hook-form";
import { InterestType } from "./EventType";

export type UserType = {
  _id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
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
  //Other users
  userInfo?: {
    _id: string;
    name?: string;
    email: string;
    countryCode?: string;
    createdAt?: string;
    updatedAt?: string;
    token?: string;
    profileImage?: string;
  };
  countTotalEventIAttended?: number;
  countFollowing?: number;
};
