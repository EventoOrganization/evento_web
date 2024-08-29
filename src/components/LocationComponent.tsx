"use client";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import MapPinIcon2 from "./icons/MappPinIcon2";

interface LocationComponentProps {
  apiKey: string;
}

const LocationComponent: React.FC<LocationComponentProps> = ({ apiKey }) => {
  const [location, setLocation] = useState<string>("Fetching location...");
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  useEffect(() => {
    // Check if geolocation is available
    if (navigator.geolocation) {
      console.log("Geolocation is supported by this browser.");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Geolocation position obtained:", position);
          const { latitude, longitude } = position.coords;
          fetchAddressFromCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Error retrieving geolocation:", error);
          setError("Unable to retrieve your location");
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchAddressFromCoordinates = async (lat: number, lng: number) => {
    console.log(`Fetching address for coordinates: (${lat}, ${lng})`);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
      );

      if (!response.ok) {
        console.error(
          "Failed to fetch from Google Maps API:",
          response.statusText,
        );
        setError("Failed to fetch address from Google Maps API");
        return;
      }

      const data = await response.json();
      console.log("Google Maps API response:", data);

      if (data.status === "OK") {
        const address = data.results[0].formatted_address;
        console.log("Address found:", address);
        setLocation(address);
      } else {
        console.error("Google Maps API error status:", data.status);
        setError("Unable to fetch address");
      }
    } catch (error) {
      console.error("An error occurred while fetching the address:", error);
      setError("An error occurred while fetching the address");
    }
  };

  return (
    <div className=" text-start text-sm" onClick={() => setIsOpen(!isOpen)}>
      <p className=" text-gray-600">Current Location</p>
      <div className="location-display flex items-center ">
        <span className="material-icons text-purple-500 mr-2">
          <MapPinIcon2 fill="purple" />
        </span>
        <div>
          <p className="text-black font-semibold">{error ? error : location}</p>
        </div>
        <ChevronDown
          className={`ml-2 transition-transform duration-100 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
    </div>
  );
};

export default LocationComponent;
