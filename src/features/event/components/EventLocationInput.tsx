import { Input } from "@/components/ui/input";
import { useEventStore } from "@/store/useEventStore";
import { useEffect, useRef, useState } from "react";

const EventLocationInput = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const eventStore = useEventStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const scriptId = "google-maps-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      // Script doesn't exist, so we create it
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsScriptLoaded(true);
      document.head.appendChild(script);
    } else {
      // Script exists, ensure it is loaded
      if (window.google) {
        setIsScriptLoaded(true);
      } else {
        script.onload = () => setIsScriptLoaded(true);
      }
    }

    return () => {
      // Don't remove the script on unmount
      // as other components might rely on it
    };
  }, [apiKey]);

  useEffect(() => {
    if (isScriptLoaded && window.google && inputRef.current && !autocomplete) {
      try {
        const newAutocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          { types: ["geocode"] },
        );
        setAutocomplete(newAutocomplete);

        newAutocomplete.addListener("place_changed", () => {
          const place = newAutocomplete.getPlace();
          if (place.geometry) {
            const { location } = place.geometry;
            const address = place.formatted_address || "";
            eventStore.setEventField("location", address);
            eventStore.setEventField("latitude", location?.lat().toString());
            eventStore.setEventField("longitude", location?.lng().toString());
          }
        });
      } catch (error) {
        console.error(
          "Failed to initialize Google Places Autocomplete:",
          error,
        );
      }
    }
  }, [isScriptLoaded, inputRef, autocomplete, eventStore]);

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
