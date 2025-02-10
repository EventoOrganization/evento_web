"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useCreateEventStore } from "@/store/useCreateEventStore";
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
  const eventStore = useCreateEventStore();
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

  const onLoad = useCallback((ref: google.maps.places.SearchBox) => {
    searchBoxRef.current = ref;
  }, []);

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
          eventStore.setEventField("location", place.formatted_address || "");
        }
      }
    }
  }, [pathname]);

  const handleManualAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setAddress(e.target.value);
    if (pathname === "/create-event") {
      eventStore.setEventField("location", e.target.value);
    }
  };

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

  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsMapVisible(!isMapVisible)}
      >
        <Label>
          {pathname === "/create-event" ? "Location" : "Location"}
          {pathname === "/create-event" && (
            <span className="text-sm text-destructive">*</span>
          )}
        </Label>
        <ChevronDown
          className={cn("transition-transform duration-300", {
            "rotate-180": isMapVisible,
          })}
        />
      </div>

      <div className="search-box">
        {isLoaded ? (
          <StandaloneSearchBox
            onLoad={onLoad}
            onPlacesChanged={onPlacesChanged}
          >
            <Input
              type="text"
              className="text-xs md:text-sm"
              placeholder={address || "Search for a location"}
              value={address}
              onChange={handleManualAddressChange}
            />
          </StandaloneSearchBox>
        ) : (
          <Input
            type="text"
            className="text-xs md:text-sm"
            placeholder="Enter location manually"
            value={address}
            onChange={handleManualAddressChange}
          />
        )}
      </div>

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

export default MyGoogleMapComponent;
