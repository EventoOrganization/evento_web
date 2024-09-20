import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEventStore } from "@/store/useEventStore";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { handleFieldChange } from "../eventActions";

const EventLocationInputFree = () => {
  const eventStore = useEventStore();
  const { register } = useFormContext();
  const [location, setLocation] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePlaceSelected = async (address: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address,
        )}`,
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = data[0].lat;
        const lng = data[0].lon;

        eventStore.setEventField("location", address);
        eventStore.setEventField("latitude", lat.toString());
        eventStore.setEventField("longitude", lng.toString());
      } else {
        console.error("No results found for the given address.");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormField
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="sr-only">Event Location</FormLabel>
          <FormControl>
            <>
              <Input
                placeholder="Enter Location"
                {...field}
                {...register("location")}
                value={eventStore.location}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(e);
                  setLocation(value);
                  handleFieldChange("location", value);
                }}
              />
              <button
                type="button"
                onClick={() => handlePlaceSelected(location)}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Get Coordinates"}
              </button>
            </>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default EventLocationInputFree;
