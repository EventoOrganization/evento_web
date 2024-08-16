// components/LocationSelector.tsx
"use client";
import { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface Location {
  lat: number;
  lng: number;
}
interface Address {
  formatted_address: string;
}

const LocationSelector = () => {
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
    setLocation({ lat, lng });
    handleClose();
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const getLocation = async () => {
      if (navigator.geolocation) {
        try {
          navigator.geolocation.getCurrentPosition((position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setMapCenter({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          });
        } catch (error: any) {
          setError(error.message);
        }
      } else {
        setError("Geolocation is not supported by this browser");
      }
    };
    getLocation();
  }, []);

  useEffect(() => {
    async function getAddress(location: Location | null) {
      if (location) {
        const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

        const res = await fetch(geocodingApiUrl);
        const data = await res.json();
        const addressData = data.results[0];
        setAddress({
          formatted_address: addressData.formatted_address,
        });
      }
    }
    getAddress(location);
  }, [location]);

  return (
    <div>
      <div className="font-bold text-slate-400">Current Location</div>
      {isOpen && (
        <div>
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
      {address ? (
        <div className="flex">
          <button onClick={handleOpen}>
            <span>
              <svg
                className="h-6 w-6 text-fuchsia-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {" "}
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />{" "}
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
          </button>
          <span className="font-bold ml-2">{address.formatted_address}</span>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default LocationSelector;
