import SmartImage from "@/components/SmartImage";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const PastEventModal = ({
  mediaItems,
  selectedMediaIndex,
  onClose,
  // eventId,
  // onMediaDelete,
}: {
  mediaItems: { url: string; type: "image" | "video" }[];
  selectedMediaIndex: number;
  onClose: () => void;
  eventId: string;
  onMediaDelete: (index: number) => void; // Callback to notify parent about the deletion
}) => {
  // const { toast } = useToast();
  const [currentMediaIndex, setCurrentMediaIndex] =
    useState(selectedMediaIndex);

  const handleDownload = async () => {
    const mediaUrl = mediaItems[currentMediaIndex].url;
    const mediaFileName = mediaUrl.split("/").pop(); // Extract the file name from the URL

    const response = await fetch(mediaUrl);
    const blob = await response.blob(); // Convert response to blob
    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = mediaFileName || "media-file"; // Provide default file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl); // Clean up the URL object
  };

  return (
    <div className="fixed inset-0 bg-black w-screen bg-opacity-90 flex items-center justify-center p-4 z-50 ">
      <Button
        onClick={onClose}
        variant={"outline"}
        className="absolute top-4 right-4 z-50"
      >
        Close
      </Button>
      <div className=" h-full">
        <Carousel
          selectedItem={selectedMediaIndex}
          onChange={(index) => setCurrentMediaIndex(index)}
          showArrows={true}
          showThumbs={false}
          dynamicHeight={false}
          emulateTouch={true}
          useKeyboardArrows={true}
          infiniteLoop={true}
          showStatus={false}
        >
          {mediaItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-center items-center h-[95.5vh] "
            >
              {item.type === "image" ? (
                <SmartImage
                  src={item.url}
                  alt={`Media ${index + 1}`}
                  width={1000}
                  height={1000}
                  className="w-full h-full object-contain"
                />
              ) : (
                <video controls autoPlay className=" h-full">
                  <source src={item.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ))}
        </Carousel>
        <button
          onClick={handleDownload}
          className="absolute top-4 left-4 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 bg-evento-gradient text-white rounded hover:opacity-80 transition"
        >
          Download
        </button>
        {/* <Button
          variant={"destructive"}
          onClick={handleDelete}
          className="absolute top-4 left-1/2 -translate-x-1/2"
        >
          Delete Media
        </Button> */}
      </div>
    </div>
  );
};

export default PastEventModal;
