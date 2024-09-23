import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GoogleMapsMap from "@/features/discover/GoogleMapsMap";
import { cn } from "@nextui-org/theme";
import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface EditableLocationProps {
  location: string;
  longitude: number;
  latitude: number;
  setLocation: (location: string) => void;
  setLongitude: (longitude: number) => void;
  setLatitude: (latitude: number) => void;
  handleReset: () => void;
  handleUpdate: () => void;
  handleCancel: () => void;
  isUpdating: boolean;
  editMode: boolean;
  toggleEditMode: () => void;
}

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = [
  "places",
];

const EditableLocation: React.FC<EditableLocationProps> = ({
  location,
  setLocation,
  longitude,
  setLongitude,
  latitude,
  setLatitude,
  handleReset,
  handleUpdate,
  handleCancel,
  isUpdating,
  editMode,
  toggleEditMode,
}) => {
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: latitude,
    lng: longitude,
  });
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false);
  // Initialize map center based on provided longitude and latitude
  useEffect(() => {
    setMapCenter({ lat: latitude, lng: longitude });
    setLocation(location);
  }, [latitude, longitude, location]);
  const { isLoaded } = useJsApiLoader({
    id: "google-maps-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });
  const onLoad = useCallback((ref: google.maps.places.SearchBox) => {
    searchBoxRef.current = ref;
  }, []);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setLatitude(lat);
      setLongitude(lng);
      setMapCenter({ lat, lng });
      fetchAddress(lat, lng); // Fetch and update address
    }
  };

  const onPlacesChanged = useCallback(() => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        const lat = place.geometry?.location?.lat() || 0;
        const lng = place.geometry?.location?.lng() || 0;
        setLatitude(lat);
        setLongitude(lng);
        setMapCenter({ lat, lng });
        setLocation(place.formatted_address || "");
      }
    }
  }, [setLatitude, setLongitude]);

  const fetchAddress = async (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    const location = { lat, lng };

    geocoder.geocode({ location }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        setLocation(results[0].formatted_address); // Set location in parent
      } else {
        console.error("Geocoder failed due to:", status);
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-2")}>
      <div className="flex justify-between">
        <h3 className="text-eventoPurpleLight">Location</h3>
        {editMode ? (
          <div className="flex gap-2">
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="bg-evento-gradient text-white"
            >
              {isUpdating ? "Updating..." : "Update"}
            </Button>
            <Button
              onClick={() => handleCancel()}
              variant="outline"
              className="text-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleReset()}
              variant="outline"
              className="text-red-600"
            >
              Reset
            </Button>
          </div>
        ) : (
          <Button onClick={toggleEditMode} variant="outline">
            Edit Location
          </Button>
        )}
      </div>
      {/* <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
        libraries={libraries}
      > */}
      <div className="space-y-4 w-full flex-grow">
        {isLoaded ? (
          <div className="flex justify-between w-full">
            <StandaloneSearchBox
              onLoad={onLoad}
              onPlacesChanged={onPlacesChanged}
            >
              <Input
                type="text"
                placeholder="Enter a location"
                className="flex-grow flex " // Ensure it's growing and filling the space
                value={location}
                disabled={!editMode}
                onChange={(e) => setLocation(e.target.value)}
              />
            </StandaloneSearchBox>
            <span
              className="flex items-center pl-2 cursor-pointer"
              onClick={() => setIsMapVisible(!isMapVisible)}
            >
              <p>Map</p>
              <ChevronDown
                className={cn("transition-transform duration-300", {
                  "rotate-180": isMapVisible,
                })}
              />
            </span>
          </div>
        ) : (
          <p>Loading...</p>
        )}

        {isMapVisible && (
          <div
            className={cn(
              "map-container h-96 max-h-full  border w-full transition-transform duration-300 rounded-lg overflow-hidden",
            )}
          >
            <GoogleMapsMap
              isLoaded={isLoaded}
              mapCenter={mapCenter}
              location={{ lat: latitude, lng: longitude }} // Updated location
              handleMapClick={(event) => editMode && handleMapClick(event)}
            />
          </div>
        )}
      </div>
      {/* </LoadScript> */}
    </div>
  );
};

export default EditableLocation;
