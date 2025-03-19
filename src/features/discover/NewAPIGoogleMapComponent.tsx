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
  const [address, setAddress] = useState<string>("");
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<
    { address: string; location: Location }[]
  >([]);

  const [mapCenter, setMapCenter] = useState<Location>({
    lat: 37.7749,
    lng: -122.4194,
  });
  const eventStore = useCreateEventStore();
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
      const location = { lat, lng };

      geocoder.geocode({ location }, async (results, status) => {
        if (status === "OK" && results && results[0]) {
          setAddress(results[0].formatted_address);
          if (pathname === "/create-event") {
            eventStore.setEventField("latitude", location.lat.toString());
            eventStore.setEventField("longitude", location.lng.toString());
            eventStore.setEventField("location", results[0].formatted_address);
          }
        } else {
          console.error("Geocoder failed:", status);
          setAddress(""); // On garde Google Places actif mais vide
        }
      });
    } catch (error) {
      console.error("Erreur dans fetchAddressAndTimeZone:", error);
      setAddress(""); // Permet de ne pas bloquer Google Places
    }
  };

  const handleSearch = (query: string) => {
    console.log("[Frontend] User typed:", query);

    setAddress(query);

    if (query.length < 3) {
      console.log("[Frontend] Query too short, not calling API.");
      setSuggestions([]);
      return;
    }

    // Annule le timeout précédent si une nouvelle saisie est détectée
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Démarre un nouveau timeout pour retarder la requête
    searchTimeout.current = setTimeout(async () => {
      try {
        console.log("[Frontend] Sending search request to API...");
        const response = await fetch("http://localhost:3000/api/googlePlaces", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        console.log("[Frontend] Response status:", response.status);

        const data = await response.json();
        console.log("[Frontend] API response:", data);

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
        defaultValue={address} // Permet d'éviter un blocage de l'input
        onChange={(e) => handleSearch(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className="bg-white border border-gray-300 rounded-md shadow-md mt-1 max-h-60 overflow-auto">
          {suggestions.map((place, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                setAddress(place.address);
                setLocation(place.location);
                setSuggestions([]); // Cacher les suggestions après sélection
              }}
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
            handleMapClick={async (event: google.maps.MapMouseEvent) => {
              if (event.latLng) {
                const lat = event.latLng.lat();
                const lng = event.latLng.lng();
                setLocation({ lat, lng });
                setMapCenter({ lat, lng });
                await fetchAddressAndTimeZone(lat, lng);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default NewAPIGoogleMapComponent;
