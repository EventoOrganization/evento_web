import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useEventStore } from "@/store/useEventStore";
import { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { useFormContext } from "react-hook-form";

const EventLocationInput = () => {
  const eventStore = useEventStore();
  const { register } = useFormContext();
  const [location, setLocation] = useState<any>("");
  const handlePlaceSelected = (value: any) => {
    if (value) {
      const address = value.label;
      setLocation(value);

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK" && results) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();

          eventStore.setEventField("location", address);
          eventStore.setEventField("latitude", lat.toString());
          eventStore.setEventField("longitude", lng.toString());
        } else {
          console.error(
            "Geocode was not successful for the following reason: " + status,
          );
        }
      });
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
              <GooglePlacesAutocomplete
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
                selectProps={{
                  value: location,
                  onChange: (value) => {
                    setLocation(value);
                    console.log(value);
                    field.onChange(value);
                  },
                  placeholder: "Enter event location...",
                  onSelect: handlePlaceSelected,
                }}
              />
            </>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default EventLocationInput;
