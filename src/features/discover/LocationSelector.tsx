"use client";
import { useEffect, useRef, useState } from "react";

interface Location {
  lat: number;
  lng: number;
}

interface Address {
  formatted_address: string;
}

interface LocationSelectorProps {
  onLocationChange: (location: Location | null) => void;
}

const LocationSelector = ({ onLocationChange }: LocationSelectorProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (window.google) {
      initMap();
    } else {
      loadGoogleMapsScript(initMap);
    }
  }, []);

  const loadGoogleMapsScript = (callback: () => void) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = callback;
    document.head.appendChild(script);
  };

  const initMap = () => {
    if (!mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 51.505, lng: -0.09 }, // Coordonnées par défaut
      zoom: 13,
    });

    map.addListener("click", (event: google.maps.MapMouseEvent) => {
      const latLng = event.latLng;
      if (!latLng) return;

      const newLocation = {
        lat: latLng.lat(),
        lng: latLng.lng(),
      };
      setLocation(newLocation);
      onLocationChange(newLocation);

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: newLocation }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          setAddress({ formatted_address: results[0].formatted_address });
        } else {
          console.error("Geocoder failed due to: " + status);
        }
      });
    });

    setIsLoading(false);
  };

  return (
    <div>
      <div className="font-bold text-slate-400">Current Location</div>
      {address ? (
        <div className="flex items-center">
          <span className="font-bold ml-2 truncate">
            {address.formatted_address}
          </span>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <div
        ref={mapRef}
        style={{ height: "400px", width: "100%", marginTop: "10px" }}
      />
    </div>
  );
};

export default LocationSelector;
