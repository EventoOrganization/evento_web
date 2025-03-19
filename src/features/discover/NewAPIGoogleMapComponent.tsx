"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useCreateEventStore } from "@/store/useCreateEventStore";
import { useJsApiLoader } from "@react-google-maps/api";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import GoogleMapsMap from "./GoogleMapsMap";

export interface Location {
  lat: number;
  lng: number;
}

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = [
  "places",
];

const NewAPIGoogleMapComponent = ({
  location,
  setLocation,
}: {
  location: Location;
  setLocation: (location: Location) => void;
}) => {
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const eventStore = useCreateEventStore();
  const [address, setAddress] = useState<string>("");
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<
    { address: string; location: Location }[]
  >([]);
  const [mapCenter, setMapCenter] = useState<Location>({
    lat: 37.7749,
    lng: -122.4194,
  });
  useEffect(() => {
    if (isMapVisible) {
      setMapCenter(location);
    }
  }, [isMapVisible, location]);
  const { isLoaded } = useJsApiLoader({
    id: "google-maps-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(currentLocation);
        setMapCenter(currentLocation);
        fetchAddressAndTimeZone(currentLocation.lat, currentLocation.lng);
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
    );
  }, [isLoaded]);

  const fetchAddressAndTimeZone = async (lat: number, lng: number) => {
    if (!isLoaded) return;
    try {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, async (results, status) => {
        if (status === "OK" && results && results[0]) {
          const formattedAddress = results[0].formatted_address;
          setAddress(formattedAddress);

          // ✅ Mise à jour du store
          if (pathname.startsWith("/create-event")) {
            eventStore.setEventField("latitude", lat.toString());
            eventStore.setEventField("longitude", lng.toString());
            eventStore.setEventField("location", formattedAddress);
          }
        } else {
          console.error("Geocoder failed:", status);
          setAddress("");
        }
      });
    } catch (error) {
      console.error("Erreur dans fetchAddressAndTimeZone:", error);
      setAddress("");
    }
  };

  const handleSearch = (query: string) => {
    setAddress(query);
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(async () => {
      try {
        const response = await fetch("/api/googlePlaces", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        const data = await response.json();
        if (data?.places?.length > 0) {
          setSuggestions(
            data.places.map((place: any) => ({
              address: place.formattedAddress,
              location: {
                lat: place.location.latitude,
                lng: place.location.longitude,
              },
            })),
          );
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("[Frontend] Error fetching places:", error);
        setSuggestions([]);
      }
    }, 500);
  };

  const handleSelectLocation = (place: {
    address: string;
    location: Location;
  }) => {
    setAddress(place.address);
    setLocation(place.location);
    setSuggestions([]);
    setMapCenter(place.location);
    // ✅ Mise à jour du store
    if (pathname.startsWith("/create-event")) {
      eventStore.setEventField("latitude", place.location.lat.toString());
      eventStore.setEventField("longitude", place.location.lng.toString());
      eventStore.setEventField("location", place.address);
    }
  };

  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setLocation({ lat, lng });
      setMapCenter({ lat, lng });
      await fetchAddressAndTimeZone(lat, lng);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsMapVisible(!isMapVisible)}
      >
        <Label>Location</Label>
        <ChevronDown
          className={cn("transition-transform duration-300", {
            "rotate-180": isMapVisible,
          })}
        />
      </div>

      <Input
        type="text"
        className="text-xs md:text-sm"
        placeholder="Search for a location"
        value={address}
        onChange={(e) => {
          handleSearch(e.target.value);
          if (pathname.startsWith("/create-event"))
            eventStore.setEventField("location", e.target.value);
        }}
      />

      {suggestions.length > 0 && (
        <ul className="bg-white border border-gray-300 rounded-md shadow-md mt-1 max-h-60 overflow-auto">
          {suggestions.map((place, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelectLocation(place)}
            >
              {place.address}
            </li>
          ))}
        </ul>
      )}

      {isMapVisible && isLoaded && (
        <div className="map-container h-96 max-h-full border w-full rounded-lg overflow-hidden">
          <GoogleMapsMap
            isLoaded={isLoaded}
            mapCenter={mapCenter}
            location={location}
            handleMapClick={handleMapClick}
          />
        </div>
      )}
    </div>
  );
};

export default NewAPIGoogleMapComponent;
