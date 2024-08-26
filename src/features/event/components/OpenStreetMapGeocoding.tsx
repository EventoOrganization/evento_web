import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventStore";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { handleFieldChange } from "../eventActions";

const OpenStreetMapGeocoding = () => {
  const eventStore = useEventStore();
  const { register } = useFormContext();
  const [locationInput, setLocationInput] = useState("");

  const handleGeocode = async (address: string, retries = 3) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      );
      if (!response.ok) {
        if (retries > 0) {
          console.warn(
            `Geocoding failed, retrying... (${retries} retries left)`,
          );
          return handleGeocode(address, retries - 1); // Retry the fetch
        } else {
          throw new Error("Geocoding failed after multiple attempts");
        }
      }
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        handleFieldChange("latitude", lat);
        handleFieldChange("longitude", lon);
        console.log({ lat, lon });
      } else {
        console.warn("No geocoding results found");
      }
    } catch (error) {
      console.error("Error during geocoding:", error);
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
              value={eventStore.location}
              onChange={(e) => {
                const newLocation = e.target.value;
                setLocationInput(newLocation);
                field.onChange(e);
                handleFieldChange("location", newLocation);
                handleGeocode(newLocation);
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
