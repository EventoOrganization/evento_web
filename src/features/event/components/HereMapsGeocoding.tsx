import { useState } from "react";

const HereMapsGeocoding = () => {
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: "", lng: "" });

  const handleGeocode = async () => {
    const response = await fetch(
      `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
        location,
      )}&apiKey=${process.env.NEXT_PUBLIC_HERE_API_KEY}`,
    );
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      const { lat, lng } = data.items[0].position;
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

export default HereMapsGeocoding;
