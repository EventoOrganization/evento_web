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
      script.onerror = () => {
        console.error("Failed to load Google Maps script");
        setIsScriptLoaded(false);
      };
      document.head.appendChild(script);
    } else if (window.google) {
      // Script exists and is already loaded
      setIsScriptLoaded(true);
    } else {
      // Script exists but is not yet loaded
      script.onload = () => setIsScriptLoaded(true);
      script.onerror = () => {
        console.error("Failed to load Google Maps script");
        setIsScriptLoaded(false);
      };
    }

    // Clean up the script if the component unmounts
    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove);
      }
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
  }, [isScriptLoaded, inputRef.current, autocomplete, eventStore]);

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
