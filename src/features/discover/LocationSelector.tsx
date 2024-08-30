"use client";
import { LatLngTuple, LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useMapEvents } from "react-leaflet";

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
  const [location, setLocation] = useState<Location | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      );
      const data = await response.json();
      setAddress({ formatted_address: data.display_name });
    } catch (error) {
      console.error("Failed to fetch address:", error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        setLocation(newLocation);
        fetchAddress(latitude, longitude);
        onLocationChange(newLocation);
      });
    }
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    const newLocation = { lat, lng };
    setLocation(newLocation);
    fetchAddress(lat, lng);
    onLocationChange(newLocation);
    setIsOpen(false);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e: LeafletMouseEvent) {
        handleMapClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const mapCenter: LatLngTuple = location
    ? ([location.lat, location.lng] as LatLngTuple)
    : ([51.505, -0.09] as LatLngTuple);

  return (
    <div>
      <div className="font-bold text-slate-400">Current Location</div>
      {address ? (
        <div className="flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center"
          >
            <svg
              className="h-6 w-6 text-fuchsia-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </button>
          <span className="font-bold ml-2 truncate">
            {address.formatted_address}
          </span>
          <svg
            className="ml-2 h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            onClick={() => setIsOpen(!isOpen)}
          >
            <path
              fillRule="evenodd"
              d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {isOpen && (
        <div>
          {/* <MapContainer
            center={mapCenter as LatLngTuple}
            zoom={13}
            style={{ height: "400px", width: "100%", marginTop: "10px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {location && <Marker position={location} />}
            <MapClickHandler />
          </MapContainer> */}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
