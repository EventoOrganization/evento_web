"use client";
import { useEventStore } from "@/store/useEventStore";
import { cn } from "@nextui-org/theme";
import Image from "next/image";
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
  const mediaPreviews = useEventStore((state) => state.mediaPreviews);
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
  //       useEventStore.setState((state) => ({
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
        <div className="relative w-full aspect-video bg-evento-gradient rounded">
          {/* <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-40  hover:opacity-80 z-10 transition-opacity duration-300 flex flex-col justify-center items-center">
            <PlusIcon onClick={openModal} className="w-36 h-36" />
            <p className="">Upload Evento Photo / Video</p>
          </div> */}
          <Image
            src="https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com/evento-bg.jpg"
            alt="Evento standard background"
            fill
            className={cn({
              "opacity-20 ": !mediaPreviews?.length,
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
          {/* <PlusIcon
            onClick={openModal}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 opacity-20 hover:opacity-60 rounded-full transition-opacity z-10 duration-300"
          /> */}
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
                  className="relative w-full aspect-video "
                  onClick={(e) => {
                    if (!isSwiping) {
                      e.stopPropagation();
                    }
                  }}
                >
                  <Image
                    src={item.url}
                    alt={`Preview media ${index + 1}`}
                    fill
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
