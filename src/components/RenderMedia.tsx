"use client";
import { EventType } from "@/types/EventType";
import { cn } from "@nextui-org/theme";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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

  const isPortrait = (mediaUrl: string) => {
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
      const img = new window.Image();
      img.src = mediaUrl;
      img.onload = () => {
        setIsPortrait(img.naturalHeight > img.naturalWidth);
      };
    }, [mediaUrl]);

    return isPortrait;
  };

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
                className={cn(
                  "absolute top-0 left-1/2 -translate-x-1/2 h-full",
                  isPortrait(item) ? "object-contain" : "object-cover",
                )}
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
                sizes="(max-width: 768px) 100vw,
                (max-width: 1200px) 50vw,
                33vw"
                className={cn(
                  " h-full",
                  isPortrait(item) ? "object-contain" : "object-cover ",
                  {
                    "opacity-20": !event,
                  },
                )}
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
