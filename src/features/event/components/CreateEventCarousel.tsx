"use client";
import SmartImage from "@/components/SmartImage";
import { cn } from "@/lib/utils";
import { useCreateEventStore } from "@/store/useCreateEventStore";
import { useEffect, useRef, useState } from "react";
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
  const mediaPreviews = useCreateEventStore((state) => state.mediaPreviews);
  const [carouselItems, setCarouselItems] = useState<any>(mediaPreviews);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef(0);
  useEffect(() => {
    setCarouselItems(mediaPreviews); // Sync with mediaPreviews
  }, [mediaPreviews]);
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
  // const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const handleVideoError = (url: string) => {
    console.error(`Failed to load video from ${url}`);
  };
  // const deleteMedia = async (index: number, mediaItem: MediaItem) => {
  //   const fileKey = new URL(mediaItem.url).pathname.substring(1);
  //   try {
  //     const success = await handleDeleteMedia(fileKey);
  //     if (success) {
  //       useCreateEventStore.setState((state) => ({
  //         mediaPreviews: state?.mediaPreviews?.filter((_, i) => i !== index),
  //       }));
  //       const updatedItems = mediaPreviews?.filter((_, i) => i !== index);
  //       setCarouselItems(updatedItems);
  //       console.log(`Successfully deleted file: ${fileKey}`);
  //     } else {
  //       console.error(`Failed to delete file: ${fileKey}`);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting media:", error);
  //   }
  // };
  return (
    <div className="relative w-full">
      {mediaPreviews?.length === 0 ? (
        <div className="relative w-full h-full bg-evento-gradient rounded">
          <SmartImage
            src="https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com/evento-bg.jpg"
            alt="Evento standard background"
            height={500}
            width={500}
            className={cn({
              "opacity-20 w-full": !mediaPreviews?.length,
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
          <Carousel
            showThumbs={false}
            dynamicHeight={true}
            infiniteLoop={true}
            emulateTouch={true}
            useKeyboardArrows={true}
          >
            {carouselItems?.map((item: MediaItem, index: number) =>
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
                    className="absolute top-0 left-0 w-full h-full object-cover rounded "
                    onError={() => handleVideoError(item.url)}
                  >
                    <source src={item.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div
                  key={index}
                  className="relative w-full aspect-auto "
                  onClick={(e) => {
                    if (!isSwiping) {
                      e.stopPropagation();
                    }
                  }}
                >
                  <SmartImage
                    src={item.url}
                    alt={`Preview media ${index + 1}`}
                    height={500}
                    width={500}
                    priority
                    className="object-cover rounded"
                  />
                </div>
              ),
            )}
          </Carousel>
        </div>
      )}
      <MediaSelectionModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default CreateEventCarousel;
