import { Input } from "@/components/ui/input";
import { useCreateEventStore } from "@/store/useCreateEventStore";
import { useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
export interface Location {
  lat: number;
  lng: number;
}
const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = [
  "places",
];
const EventLocationInput = () => {
  const eventStore = useCreateEventStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-maps-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  useEffect(() => {
    if (isLoaded && window.google && inputRef.current && !autocomplete) {
      try {
        const newAutocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          { types: ["geocode"] },
        );
        setAutocomplete(newAutocomplete);

        newAutocomplete.addListener("place_changed", () => {
          const place = newAutocomplete.getPlace();
          if (place.geometry) {
          }
        });
      } catch (error) {
        console.error(
          "Failed to initialize Google Places Autocomplete:",
          error,
        );
      }
    }
  }, [isLoaded, inputRef.current, autocomplete]);

  return (
    <Input
      ref={inputRef}
      type="text"
      placeholder={eventStore.location || "Enter event location..."}
      className="input-class-name"
      // required
    />
  );
};

export default EventLocationInput;
