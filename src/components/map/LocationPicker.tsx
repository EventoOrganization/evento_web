// components/LocationPicker.tsx
"use client";
import { useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface Location {
  lat: number;
  lng: number;
}

const LocationPicker = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [mapCenter, setMapCenter] = useState<Location>({
    lat: 37.7749,
    lng: -122.4194,
  });
  const { isLoaded } = useJsApiLoader({
    id: "google-maps-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const handleMapClick = (event: any) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setLocation({ lat, lng });
    setMapCenter({ lat, lng });
  };

  return (
    <div>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ height: "400px", width: "800px" }}
          center={mapCenter}
          zoom={12}
          onClick={handleMapClick}
        >
          {location && <Marker position={location} />}
        </GoogleMap>
      )}
      {location && (
        <p>
          Selected location: {location.lat}, {location.lng}
        </p>
      )}
    </div>
  );
};

export default LocationPicker;
