"use client";
import { useEventStore } from "@/store/useEventStore";
import { cn } from "@nextui-org/theme";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import MediaSelectionModal from "./MediaSelectionModal";

const CreateEventCarousel = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { imagePreviews, videoPreview } = useEventStore((state) => ({
    imagePreviews: state.imagePreviews,
    videoPreview: state.videoPreview,
  }));

  const mediaItems = [...(imagePreviews || [])];
  if (videoPreview) {
    mediaItems.push(videoPreview);
  }

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

  const isValidUrl = (url: string) => {
    return url.startsWith("http://") || url.startsWith("https://");
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div>
      {mediaItems.length === 0 ? (
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
              "opacity-20": !imagePreviews?.length && !videoPreview,
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
            {mediaItems.map((item, index) =>
              isValidUrl(item) && item.endsWith(".mp4") ? (
                <div
                  key={index}
                  className="relative w-full pb-[56.25%]"
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
                    <source src={item} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div
                  key={index}
                  className="relative w-full pb-[56.25%]"
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    if (!isSwiping) {
                      openModal();
                      e.stopPropagation();
                    }
                  }}
                >
                  <Image
                    src={item}
                    alt={`Preview media ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw,
                    (max-width: 1200px) 50vw,
                    33vw"
                    className={cn({
                      "opacity-20": !imagePreviews?.length && !videoPreview,
                    })}
                    priority
                  />
                </div>
              ),
            )}
          </Carousel>
        </div>
      )}

      {/* Render Modal Outside the Carousel */}
      <MediaSelectionModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default CreateEventCarousel;
