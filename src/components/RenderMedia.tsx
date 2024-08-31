"use client";
import { EventType } from "@/types/EventType";
import { cn } from "@nextui-org/theme";
import Image from "next/image";
import { useRef, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const RenderMedia = ({ event }: { event: EventType }) => {
  const mediaItems = [];
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef(0);
  if (event?.details?.images) {
    mediaItems.push(...event.details.images);
  }

  if (event?.details?.video) {
    mediaItems.push(event.details.video);
  }

  const isValidUrl = (url: string) => {
    return url.startsWith("http://") || url.startsWith("https://");
  };

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
        // showArrows={false}
        useKeyboardArrows={true}
      >
        {mediaItems.map((item, index) =>
          isValidUrl(item) && item.endsWith(".mp4") ? (
            <div
              key={index}
              className="relative w-full pb-[56.25%]"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                if (!isSwiping) {
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
                  e.stopPropagation();
                }
              }}
            >
              <Image
                src={item}
                alt={`Event media ${index + 1}`}
                fill
                objectFit="cover"
                className={cn({
                  "opacity-20": !event,
                })}
              />
            </div>
          ),
        )}
      </Carousel>
    </div>
  );
};

export default RenderMedia;