import { cn } from "@/lib/utils";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import MapPinIcon2 from "../icons/MappPinIcon2";

interface Location {
  lat: number;
  lng: number;
}
interface Address {
  formatted_address: string;
}

const LocationSelector = ({
  onLocationChange,
}: {
  onLocationChange: (location: Location) => void;
}) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [mapCenter, setMapCenter] = useState<Location>({
    lat: 37.7749,
    lng: -122.4194,
  });
  const [address, setAddress] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { isLoaded } = useJsApiLoader({
    id: "google-maps-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const handleMapClick = (event: any) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newLocation = { lat, lng };
    setLocation(newLocation);
    onLocationChange(newLocation);
    localStorage.setItem("location", JSON.stringify(newLocation));
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const getStoredLocation = () => {
      const storedLocation = localStorage.getItem("location");
      if (storedLocation) {
        const parsedLocation = JSON.parse(storedLocation);
        setLocation(parsedLocation);
        setMapCenter(parsedLocation);
        onLocationChange(parsedLocation);
        console.log("Location loaded from localStorage:", parsedLocation);
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);
          setMapCenter(newLocation);
          localStorage.setItem("location", JSON.stringify(newLocation));
          console.log("Location retrieved from geolocation:", newLocation);
        });
      } else {
        setError("Geolocation is not supported by this browser");
        console.error("Geolocation not supported or failed");
      }
    };

    getStoredLocation();
  }, []);

  useEffect(() => {
    const getAddress = async (location: Location | null) => {
      if (location) {
        setAddress(null); // Reset address before fetching new one
        const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

        try {
          const res = await fetch(geocodingApiUrl);
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            const addressData = data.results[0];
            const newAddress = {
              formatted_address: addressData.formatted_address,
            };
            setAddress(newAddress);
            localStorage.setItem("address", JSON.stringify(newAddress));
          } else {
            setError("Unable to fetch address");
          }
        } catch (error) {
          setError("Failed to fetch address");
        }
      }
    };

    getAddress(location);
  }, [location]); // Trigger this effect whenever the location changes

  return (
    <div className="flex flex-col gap-2 ">
      {address ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex justify-between items-center rounded-lg "
        >
          <MapPinIcon2 />
          <span className=" break-words line-clamp-1 font-bold whitespace-normal text-ellipsis overflow-hidden max-w-1/2 truncate">
            {address.formatted_address}
          </span>
          <ChevronDown
            strokeWidth={3}
            className={cn("transition-transform duration-200", {
              "rotate-180": isOpen,
            })}
          />
        </button>
      ) : (
        <p>Loading...</p>
      )}
      {isOpen && (
        <div
          className={cn(
            "transition-all duration-500 ease-in-out  overflow-hidden",
            { "max-h-0": !isOpen, "max-h-screen mt-4": isOpen },
          )}
        >
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={{ height: "500px", width: "100%" }}
              center={mapCenter}
              zoom={14}
              onClick={handleMapClick}
            >
              {location && <Marker position={location} />}
            </GoogleMap>
          )}
          {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
