"use client";
import { EventType } from "@/types/EventType";
import Image from "next/image";
// import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const RenderMedia = ({ event }: { event: EventType }) => {
  const mediaItems: string[] = [];
  const [isSwiping, setIsSwiping] = useState(false);
  // const pathname = usePathname();
  const touchStartX = useRef(0);
  if (event?.details?.images) {
    mediaItems.push(...event.details.images);
  }

  if (event?.details?.video) {
    mediaItems.push(event.details.video);
  }
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

  const handleVideoError = (url: string) => {
    console.error(`Failed to load video from ${url}`);
  };
  return (
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
          item === "video" ? (
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
                onError={() => handleVideoError(item)}
              >
                <source src={item} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div
              key={index}
              className="relative w-full  pb-[56.25%]"
              onClick={(e) => {
                if (!isSwiping) {
                  e.stopPropagation();
                }
              }}
            >
              <Image
                src={item}
                alt={`Preview media ${index + 1}`}
                width={1920}
                height={1080}
                className="h-auto max-h-screen"
                priority
              />
            </div>
          ),
        )}
      </Carousel>
    </div>
  );
};

export default RenderMedia;
