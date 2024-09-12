import { GoogleMap, Marker } from "@react-google-maps/api";
import { Location } from "./MyGoogleMapComponent";

interface GoogleMapsMapProps {
  isLoaded: boolean;
  mapCenter: Location;
  location: Location | null;
  handleMapClick: (event: google.maps.MapMouseEvent) => void;
}

const GoogleMapsMap = ({
  isLoaded,
  mapCenter,
  location,
  handleMapClick,
}: GoogleMapsMapProps) => {
  return (
    <>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={mapCenter}
          zoom={12}
          onClick={handleMapClick}
        >
          {location && <Marker position={location} />}
        </GoogleMap>
      )}
    </>
  );
};

export default GoogleMapsMap;
