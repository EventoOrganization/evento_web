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
