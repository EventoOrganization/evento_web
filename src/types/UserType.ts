export type User = {
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
  upcomingEvents?: Event[];
  filteredUpcomingEventsAttened?: Event[];
  filteredPastEventsAttended?: Event[];
  pastEvents?: Event[];
  totalEventAttended?: number;

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
