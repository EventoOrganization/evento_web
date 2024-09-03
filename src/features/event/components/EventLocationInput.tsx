import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEventStore } from "@/store/useEventStore";
import { useEffect, useRef, useState } from "react";

const EventLocationInput = ({
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  placeholder = "Enter event location...",
}) => {
  const eventStore = useEventStore();
  const [location, setLocation] = useState<string>("");
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const existingScript = document.querySelector(
      `script[src*="https://maps.googleapis.com/maps/api/js"]`,
    );

    const loadScript = (url: string, callback: () => void): void => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = url;
      script.async = true;
      script.defer = true;
      script.onload = callback;
      document.head.appendChild(script);
    };

    const initializeAutocomplete = (): void => {
      if (window.google && window.google.maps && inputRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          { types: ["geocode"] },
        );

        autocompleteRef.current = autocomplete;

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place && place.geometry && place.geometry.location) {
            const address = place.formatted_address || "";
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            setLocation(address);
            eventStore.setEventField("location", address);
            eventStore.setEventField("latitude", lat.toString());
            eventStore.setEventField("longitude", lng.toString());
          }
        });
      }
    };

    if (!existingScript) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`,
        initializeAutocomplete,
      );
    } else {
      initializeAutocomplete();
    }
  }, [apiKey]);

  return (
    <FormField
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="sr-only">Event Location</FormLabel>
          <FormControl>
            <Input
              type="text"
              ref={inputRef}
              placeholder={placeholder}
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                field.onChange(e.target.value); // Update the form field value
              }}
              className="input-class-name" // Add your input class name here
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default EventLocationInput;
