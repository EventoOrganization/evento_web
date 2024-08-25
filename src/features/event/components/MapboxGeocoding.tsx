import { useState } from "react";

const MapboxGeocoding = () => {
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: "", lng: "" });

  const handleGeocode = async () => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        location,
      )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`,
    );
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const { center } = data.features[0];
      setCoordinates({ lat: center[1], lng: center[0] });
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

export default MapboxGeocoding;
