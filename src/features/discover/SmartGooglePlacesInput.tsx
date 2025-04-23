"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useJsApiLoader } from "@react-google-maps/api";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import GoogleMapsMap from "./GoogleMapsMap"; // Ton composant map

const libraries: "places"[] = ["places"];

export interface Location {
  lat: number;
  lng: number;
}

interface Props {
  location: Location;
  setLocation: (location: Location) => void;
  onAddressChange?: (formattedAddress: string) => void;
}

const SmartMapLocationPicker = ({
  location,
  setLocation,
  onAddressChange,
}: Props) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-maps-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken | null>(null);
  const [mapCenter, setMapCenter] = useState<Location>({ lat: 0, lng: 0 });
  const [isMapVisible, setIsMapVisible] = useState(false);
  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(
    null,
  );
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoaded) {
      autocompleteServiceRef.current =
        new google.maps.places.AutocompleteService();
      const dummyMap = new google.maps.Map(mapRef.current!);
      placesServiceRef.current = new google.maps.places.PlacesService(dummyMap);
      setSessionToken(new google.maps.places.AutocompleteSessionToken());

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setLocation(coords);
          setMapCenter(coords);
          reverseGeocode(coords.lat, coords.lng);
        },
        (err) => console.error("Geolocation error:", err),
      );
    }
  }, [isLoaded]);

  const reverseGeocode = (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const formatted = results[0].formatted_address;
        setQuery(formatted);
        if (onAddressChange) onAddressChange(formatted);
      }
    });
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (!autocompleteServiceRef.current || !sessionToken || value.length < 3) {
      setSuggestions([]);
      return;
    }

    autocompleteServiceRef.current.getPlacePredictions(
      {
        input: value,
        sessionToken,
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setSuggestions(results);
        } else {
          setSuggestions([]);
        }
      },
    );
  };

  const handleSelectSuggestion = (placeId: string, description: string) => {
    if (!placesServiceRef.current || !sessionToken) return;

    placesServiceRef.current.getDetails(
      {
        placeId,
        sessionToken,
        fields: ["geometry", "formatted_address"],
      },
      (place, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          place?.geometry?.location
        ) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const coords = { lat, lng };
          setLocation(coords);
          setMapCenter(coords);
          setQuery(description);
          setSuggestions([]);
          if (onAddressChange)
            onAddressChange(place.formatted_address || description);
          setSessionToken(new google.maps.places.AutocompleteSessionToken());
        }
      },
    );
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const coords = { lat, lng };
      setLocation(coords);
      setMapCenter(coords);
      reverseGeocode(lat, lng);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsMapVisible(!isMapVisible)}
      >
        <Label>Location</Label>
        <ChevronDown
          className={cn("transition-transform", { "rotate-180": isMapVisible })}
        />
      </div>

      <Input
        type="text"
        placeholder="Search for a location..."
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        className="text-sm"
      />

      {suggestions.length > 0 && (
        <ul className="bg-white border shadow rounded mt-1 max-h-60 overflow-auto z-50">
          {suggestions.map((sug) => (
            <li
              key={sug.place_id}
              onClick={() =>
                handleSelectSuggestion(sug.place_id, sug.description)
              }
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {sug.description}
            </li>
          ))}
        </ul>
      )}

      {isMapVisible && isLoaded && (
        <div className="map-container h-96 w-full border rounded overflow-hidden">
          <GoogleMapsMap
            isLoaded={isLoaded}
            mapCenter={mapCenter}
            location={location}
            handleMapClick={handleMapClick}
          />
        </div>
      )}

      <div ref={mapRef} style={{ display: "none" }} />
    </div>
  );
};

export default SmartMapLocationPicker;
