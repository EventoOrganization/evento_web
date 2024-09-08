"use client";
import { useEventStore } from "@/store/useEventStore";
import { cn } from "@nextui-org/theme";
import { PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import MediaSelectionModal from "./MediaSelectionModal";

// Definition of the MediaItem type
type MediaItem = {
  url: string;
  type: "image" | "video";
};

const CreateEventCarousel = ({
  setMedia,
}: {
  setMedia: (media: File[]) => void;
}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  // Ensure mediaPreviews always return an array of MediaItem objects
  const mediaPreviews = useEventStore((state) => {
    const mediaItems = state.mediaPreviews || [];
    // Convert strings to objects with default type "image" if necessary
    return mediaItems.map((item) =>
      typeof item === "string"
        ? { url: item, type: item.endsWith(".mp4") ? "video" : "image" }
        : item,
    ) as MediaItem[];
  });

  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchCurrentX = e.touches[0].clientX;
    if (Math.abs(touchCurrentX - touchStartX.current) > 10) {
      setIsSwiping(true);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const deleteMedia = async (index: number, mediaItem: MediaItem) => {
    useEventStore.setState((state) => ({
      mediaPreviews: state?.mediaPreviews?.filter((_, i) => i !== index),
    }));

    const fileName = mediaItem.url.split("/").pop();
    if (fileName) {
      try {
        const response = await fetch("/api/cleanupTempFiles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ files: [fileName] }),
        });

        if (!response.ok) {
          console.error("Failed to delete file from server");
        }
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  const handleVideoError = (url: string) => {
    console.error(`Failed to load video from ${url}`);
  };

  return (
    <div className="relative">
      {mediaPreviews.length === 0 ? (
        <div className="relative w-full pb-[56.25%] cursor-pointer bg-evento-gradient">
          <PlusIcon
            onClick={openModal}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20 hover:opacity-60 z-10 transition-opacity duration-300"
          />
          <Image
            src="https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com/evento-bg.jpg"
            alt="Evento standard background"
            fill
            sizes="(max-width: 768px) 100vw,
                    (max-width: 1200px) 50vw,
                    33vw"
            className={cn({
              "opacity-20": !mediaPreviews?.length,
            })}
            priority
          />
        </div>
      ) : (
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <PlusIcon
            onClick={openModal}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 opacity-20 hover:opacity-60 rounded-full transition-opacity z-10 duration-300"
          />
          <Carousel
            showThumbs={false}
            dynamicHeight={true}
            infiniteLoop={true}
            emulateTouch={true}
            useKeyboardArrows={true}
          >
            {mediaPreviews.map((item, index) =>
              item.type === "video" ? (
                <div
                  key={index}
                  className="relative w-full pb-[56.25%]"
                  onClick={(e) => {
                    if (!isSwiping) {
                      e.stopPropagation();
                    }
                  }}
                >
                  <video
                    controls
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    onError={() => handleVideoError(item.url)}
                  >
                    <source src={item.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {/* Bouton de suppression */}
                  <button
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full"
                    onClick={() => deleteMedia(index, item)}
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <div
                  key={index}
                  className="relative w-full pb-[56.25%]"
                  onClick={(e) => {
                    if (!isSwiping) {
                      e.stopPropagation();
                    }
                  }}
                >
                  <Image
                    src={item.url}
                    alt={`Preview media ${index + 1}`}
                    width={1920}
                    height={1080}
                    className="h-auto"
                    priority
                  />
                  {/* Bouton de suppression */}
                  <button
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full"
                    onClick={() => deleteMedia(index, item)}
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              ),
            )}
          </Carousel>
        </div>
      )}
      <MediaSelectionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        setMedia={setMedia}
      />
    </div>
  );
};

export default CreateEventCarousel;
