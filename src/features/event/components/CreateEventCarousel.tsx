"use client";
import { useEventStore } from "@/store/useEventStore";
import { cn } from "@nextui-org/theme";
import { PlusIcon } from "lucide-react";
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

const CreateEventCarousel = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  // Fetch the media previews from the store
  const mediaPreviews = useEventStore((state) => {
    // Ensure that mediaPreviews is always an array of MediaItem
    const mediaItems = state.mediaPreviews || [];
    // Check if mediaItems might be incorrectly typed or undefined
    if (mediaItems && Array.isArray(mediaItems)) {
      return mediaItems.map((item) => {
        if (typeof item === "string") {
          // Assuming that if it's a string, it should be an image URL
          return { url: item, type: "image" } as MediaItem;
        } else if (
          typeof item === "object" &&
          "url" in item &&
          "type" in item
        ) {
          // If the item is already a MediaItem, return it as is
          return item as MediaItem;
        }
        // Fallback in case the structure is unexpected
        console.warn(
          "Unexpected media item structure, defaulting to image:",
          item,
        );
        return { url: "", type: "image" } as MediaItem;
      });
    }

    // If mediaItems is not an array, return an empty array
    return [] as MediaItem[];
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

  const isValidUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    return (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("blob:")
    );
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // console.log("Media Previews in Store:", mediaPreviews);

  return (
    <div>
      {mediaPreviews.length === 0 ? (
        <div
          className="relative w-full pb-[56.25%] cursor-pointer bg-evento-gradient"
          onClick={openModal}
        >
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
          <PlusIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20 hover:opacity-60" />
        </div>
      ) : (
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Carousel
            showThumbs={false}
            dynamicHeight={true}
            infiniteLoop={true}
            emulateTouch={true}
            useKeyboardArrows={true}
          >
            {mediaPreviews.map((item, index) => {
              // console.log(`Rendering item ${index}:`, item);
              return isValidUrl(item.url) && item.type === "video" ? (
                <div
                  key={index}
                  className="relative w-full pb-[56.25%] "
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    if (!isSwiping) {
                      openModal();
                      e.stopPropagation();
                    }
                  }}
                >
                  <video
                    controls
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  >
                    <source src={item.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div
                  key={index}
                  className="relative w-full pb-[56.25%] "
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    if (!isSwiping) {
                      openModal();
                      e.stopPropagation();
                    }
                  }}
                >
                  <Image
                    src={item.url}
                    alt={`Preview media ${index + 1}`}
                    width={1920}
                    height={1080}
                    className={cn("h-auto", {
                      "opacity-20": !mediaPreviews?.length,
                    })}
                    priority
                  />
                </div>
              );
            })}
          </Carousel>
        </div>
      )}

      {/* Render Modal Outside the Carousel */}
      <MediaSelectionModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default CreateEventCarousel;
