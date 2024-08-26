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

const OpenStreetMapGeocoding = () => {
  const eventStore = useEventStore();
  const { register } = useFormContext();
  const [locationInput, setLocationInput] = useState("");

  const handleGeocode = async (address: string) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
    );
    const data = await response.json();
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      eventStore.setEventField("latitude", lat);
      eventStore.setEventField("longitude", lon);
      console.log({ lat, lon });
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
              value={locationInput}
              onChange={(e) => {
                const newLocation = e.target.value;
                setLocationInput(newLocation);
                field.onChange(e);
                handleFieldChange("location", newLocation);
                handleGeocode(newLocation);
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default OpenStreetMapGeocoding;
