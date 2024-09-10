import { Input } from "@/components/ui/input";
import { useEventStore } from "@/store/useEventStore";
import { useEffect, useRef, useState } from "react";

const EventLocationInput = ({}) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const eventStore = useEventStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const placeholder = eventStore.location || "Enter event location...";
  useEffect(() => {
    if (typeof window === "undefined" || isScriptLoaded) return;

    const scriptId = "google-maps-script";
    const existingScript = document.getElementById(scriptId);

    const loadScript = () => {
      if (existingScript) return;

      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "text/javascript";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsScriptLoaded(true);
      document.head.appendChild(script);
    };

    loadScript();

    return () => {
      const loadedScript = document.getElementById(scriptId);
      if (loadedScript) {
        loadedScript.remove();
      }
    };
  }, [apiKey, isScriptLoaded]);

  useEffect(() => {
    if (!isScriptLoaded || !window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["geocode"],
      },
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const { location } = place.geometry;
        const address = place.formatted_address || "";
        eventStore.setEventField("location", address);
        eventStore.setEventField("latitude", location?.lat().toString());
        eventStore.setEventField("longitude", location?.lng().toString());
      }
    });

    return () => autocomplete.unbindAll();
  }, [eventStore, isScriptLoaded]);

  return (
    <Input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      className="input-class-name"
      required
    />
  );
};

export default EventLocationInput;
