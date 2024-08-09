interface Location {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface Event {
  name?: string;
  images?: string[];
  loc?: Location;
  mode?: string;
  location?: string;
  longitude?: string;
  latitude?: string;
  date?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  createRSVP?: boolean;
  description?: string;
  includeChat?: boolean;
  urlLink?: string;
  thumbnailVideo?: string;
  video?: string;
}

interface EventDetailss {
  // Define the EventDetailss interface properties here
}

interface Users {
  // Define the Users interface properties here
}

interface Interest {
  // Define the Interest interface properties here
}

interface RsvpForm {
  // Define the RsvpForm interface properties here
}

export interface Event {
  details?: EventDetailss;
  allUploadPhotoVideo?: number;
  id?: string;
  user?: Users;
  title?: string;
  eventType?: string;
  interest?: Interest[];
  privateEventLink?: string;
  coHosts?: Users[];
  // guests: string[];
  guestsAllowFriend?: boolean;
  v?: number;
  attendeesCount?: number;
  attendeeDetails?: Users[];
  rsvpForm?: RsvpForm;
  coHostStatus?: boolean;

  attended?: boolean;
  Favourite?: boolean;
  shareAccess?: boolean;
  deleteAccess?: boolean;
}

interface UpcomingUser {}
interface CreateEventDetails {}
export interface Interests {
  id?: string;
  name?: string;
  image?: string;
  v?: number;
  isSelected: boolean;
}
interface Guests {}
interface CreateRSVPForm {}
interface AttendessDetail {}
interface GroupDetaill {}

export interface EventData {
  privateEventLink?: string;
  coHostOrGuestYouAre?: boolean;
  coHostYouAre?: boolean;
  coHostStatus?: boolean;
  addAccessPermission?: string;
  user?: UpcomingUser;
  eventType?: string;
  details?: CreateEventDetails;
  interest?: Interests[];
  coHosts?: Guests[];
  guests?: Guests[];
  allUploadPhotoVideo?: number;
  rsvpForm?: CreateRSVPForm;
  guestsAllowFriend?: boolean;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;

  attendeesCount?: number;
  attendess?: AttendessDetail[];
  favourite?: boolean;
  deleteAccess?: boolean;
  shareAccess?: boolean;
  isPast?: boolean;
  attended?: boolean;
  // urLlink: string;
  groupDetail?: GroupDetaill;
}
