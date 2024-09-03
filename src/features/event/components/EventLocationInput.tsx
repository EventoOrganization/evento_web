import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useEventStore } from "@/store/useEventStore";
import { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const EventLocationInput = ({
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  placeholder = "Enter event location...",
}) => {
  const eventStore = useEventStore();
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
            <GooglePlacesAutocomplete
              apiKey={apiKey}
              selectProps={{
                value: location,
                onChange: (value) => {
                  handlePlaceSelected(value);
                  field.onChange(value.label); // Update the form field value
                },
                onSelect: handlePlaceSelected, // Required to prevent TypeScript errors
                placeholder,
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default EventLocationInput;
