// components/GetCurrentLocation.tsx
"use client";
import { useState, useEffect } from "react";
//import apiService from "@/lib/apiService";

interface Location {
  latitude: number;
  longitude: number;
}

interface Address {
  formatted_address: string;
}

const GetCurrentLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      if (navigator.geolocation) {
        try {
          navigator.geolocation.getCurrentPosition((position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
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
        const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

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
      {address ? (
        <div className="flex">
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
          <span className="font-bold ml-2">{address.formatted_address}</span>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {error ? <p style={{ color: "red" }}>{error}</p> : null}
    </div>
  );
};

export default GetCurrentLocation;
