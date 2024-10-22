"use client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventStore";
import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import GoogleMapsMap from "./GoogleMapsMap";

export interface Location {
  lat: number;
  lng: number;
}
const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = [
  "places",
];

const MyGoogleMapComponent = ({
  location,
  setLocation,
}: {
  location: Location;
  setLocation: (location: Location) => void;
}) => {
  const pathname = usePathname();
  const [address, setAddress] = useState<string>("");
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false);
  const eventStore = useEventStore();
  const [mapCenter, setMapCenter] = useState<Location>({
    lat: 37.7749,
    lng: -122.4194,
  });
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-maps-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  // Function to fetch address and timezone for the provided lat and lng
  const fetchAddressAndTimeZone = async (lat: number, lng: number) => {
    if (!isLoaded) return;

    const geocoder = new google.maps.Geocoder();
    const location = { lat, lng };

    // Geocode to get the formatted address
    geocoder.geocode({ location }, async (results, status) => {
      if (status === "OK" && results && results[0]) {
        setAddress(results[0].formatted_address);

        // Fetch timezone based on lat/lng
        const timeZone = await fetchTimeZone(lat, lng);
        if (timeZone) {
          eventStore.setEventField("timeZone", timeZone);
        }
      } else {
        console.error("Geocoder failed due to:", status);
      }
    });
  };

  // Function to fetch timezone from Google Time Zone API
  const fetchTimeZone = async (lat: number, lng: number) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${Math.floor(
      Date.now() / 1000,
    )}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "OK") {
        return data.timeZoneId; // E.g., 'America/Los_Angeles'
      }
      console.error("Failed to fetch timezone data:", data.status);
    } catch (error) {
      console.error("Error fetching timezone:", error);
    }
  };

  // Fetch user's current location using Geolocation API
  useEffect(() => {
    const fetchCurrentLocation = () => {
      const storedPermissions = JSON.parse(
        localStorage.getItem("userPermissions") || "{}",
      );
      if (storedPermissions.geolocation === "granted") {
        // comment jouer ca que si dans userpermissions geolocation est set a "granted"?
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
            console.error("Error fetching the geolocation", error);
          },
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    fetchCurrentLocation();
  }, [isLoaded]);

  // Handle the load event of the search box
  const onLoad = useCallback((ref: google.maps.places.SearchBox) => {
    searchBoxRef.current = ref;
  }, []);

  // Handle map click to set the location and fetch address and timezone
  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setLocation({ lat, lng });
      setMapCenter({ lat, lng });
      await fetchAddressAndTimeZone(lat, lng);
      if (pathname === "/create-event") {
        eventStore.setEventField("latitude", lat.toString());
        eventStore.setEventField("longitude", lng.toString());
        eventStore.setEventField("location", address);
      }
    }
  };

  // Handle place selection from the search box
  const onPlacesChanged = useCallback(() => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        const lat = place.geometry?.location?.lat() || 0;
        const lng = place.geometry?.location?.lng() || 0;
        setLocation({ lat, lng });
        setMapCenter({ lat, lng });
        fetchAddressAndTimeZone(lat, lng);
        if (pathname === "/create-event") {
          eventStore.setEventField("latitude", lat.toString());
          eventStore.setEventField("longitude", lng.toString());
          eventStore.setEventField("location", place.formatted_address);
        }
      }
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsMapVisible(!isMapVisible)}
      >
        <h4 className="text-purple-600 font-bold">
          {pathname === "/create-event"
            ? "Choose Location"
            : "Current Location"}
        </h4>
        <span className="flex items-center gap-2">
          <p>Show map</p>
          <ChevronDown
            className={cn("transition-transform duration-300", {
              "rotate-180": isMapVisible,
            })}
          />
        </span>
      </div>
      <div className="search-box">
        {isLoaded ? (
          <StandaloneSearchBox
            onLoad={onLoad}
            onPlacesChanged={onPlacesChanged}
          >
            <Input
              type="text"
              placeholder={
                pathname === "/discover" && "Enter a location"
                  ? address
                  : "Enter a location"
              }
            />
          </StandaloneSearchBox>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {isMapVisible && (
        <div
          className={cn(
            "map-container h-96 max-h-full  border w-full transition-transform duration-300 rounded-lg overflow-hidden",
          )}
        >
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

export default MyGoogleMapComponent;
