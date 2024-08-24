import { useEventStore } from "@/store/useEventStore";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import GooglePlacesAutocomplete from "react-google-autocomplete";

const EventLocationInput = () => {
  const eventStore = useEventStore();
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handlePlaceSelected = (place: any) => {
    const address = place.formatted_address;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    setLocation(address);
    setCoordinates({ lat, lng });

    // Stocker l'adresse et les coordonnées dans le store
    eventStore.setEventField("location", address);
    eventStore.setEventField("latitude", lat.toString());
    eventStore.setEventField("longitude", lng.toString());
  };

  return (
    <FormField
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex gap-2 items-center">
            <i className="icon-location" />
            Event Location
          </FormLabel>
          <FormControl>
            <>
              <GooglePlacesAutocomplete
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                selectProps={{
                  value: location,
                  onChange: (value) => setLocation(value),
                  placeholder: "Enter event location...",
                }}
                onPlaceSelected={handlePlaceSelected}
                types={["address"]}
                className="text-sm text-muted-foreground"
              />
            </>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default EventLocationInput;
