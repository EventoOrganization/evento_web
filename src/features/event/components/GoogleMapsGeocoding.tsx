import { useState } from "react";

const GoogleMapsGeocoding = () => {
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: "", lng: "" });

  const handleGeocode = async () => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location,
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      setCoordinates({ lat, lng });
    }
    console.log(coordinates);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button type="button" onClick={handleGeocode}>
        Get Coordinates
      </button>
      {coordinates.lat && (
        <p>
          Latitude: {coordinates.lat}, Longitude: {coordinates.lng}
        </p>
      )}
    </div>
  );
};

export default GoogleMapsGeocoding;
