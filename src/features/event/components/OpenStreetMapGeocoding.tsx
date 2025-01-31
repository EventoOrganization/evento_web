"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCreateEventStore } from "@/store/useCreateEventStore";
import { debounce } from "lodash";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { handleFieldChange } from "../eventActions";
const OpenStreetMapGeocoding = () => {
  const eventStore = useCreateEventStore();
  const { register } = useFormContext();
  const [locationInput, setLocationInput] = useState("");
  const [lastFetchedLocation, setLastFetchedLocation] = useState("");

  const handleGeocode = debounce(async (address: string) => {
    if (address.length < 10 || address === lastFetchedLocation) {
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      );
      if (!response.ok) {
        throw new Error("Geocoding failed");
      }
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        console.log({ lat, lon });
        setLastFetchedLocation(address);
        handleFieldChange("latitude", lat);
        handleFieldChange("longitude", lon);
      } else {
        console.warn("No geocoding results found");
      }
    } catch (error) {
      console.error("Error during geocoding:", error);
    }
  }, 1000);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = e.target.value;
    setLocationInput(newLocation);

    if (newLocation.length >= 10) {
      handleGeocode(newLocation);
    }
  };
  return (
    <FormField
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="sr-only">Event Location</FormLabel>
          <FormControl>
            <Input
              placeholder="Full Address"
              {...field}
              {...register("location")}
              value={eventStore.location || ""} // Ensure a controlled input
              onChange={(e) => {
                const newLocation = e.target.value;
                setLocationInput(newLocation);
                field.onChange(e);
                handleFieldChange("location", newLocation);
                handleChange;
              }}
              onBlur={() => {
                handleGeocode(locationInput);
              }}
              className={cn({
                "bg-evento-gradient ":
                  eventStore.longitude && eventStore.latitude,
              })}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default OpenStreetMapGeocoding;
