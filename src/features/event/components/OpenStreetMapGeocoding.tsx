import { useState } from "react";

const OpenStreetMapGeocoding = () => {
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: "", lng: "" });

  const handleGeocode = async () => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        location,
      )}&format=json&limit=1`,
    );
    const data = await response.json();
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      setCoordinates({ lat, lng: lon });
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

export default OpenStreetMapGeocoding;
