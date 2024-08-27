import { EventDetails } from "./EventDetailsType";
import { Interest } from "./InterestType";

export type Event = {
  _id: string;
  title: string;
  eventType: "public" | "private";
  details?: EventDetails;
  interest: Interest[];
  coHosts: Array<{ _id: string; name: string }>;
  guests: Array<{ _id: string; name: string }>;
  createdAt: string;
  updatedAt: string;
};
