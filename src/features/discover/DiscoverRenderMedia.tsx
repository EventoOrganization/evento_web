"use client";
import { EventType } from "@/types/EventType";
import Image from "next/image";
// import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const RenderMedia = ({ event }: { event: EventType }) => {
  const mediaItems: string[] = [];
  const initialMedias = event?.initialMedia || [];
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
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      className=" h-full"
    >
      <Carousel
        showThumbs={false}
        dynamicHeight={false}
        infiniteLoop={true}
        emulateTouch={true}
        useKeyboardArrows={true}
        className=" relative "
      >
        {initialMedias.map((item, index) =>
          item.type === "video" ? (
            <video
              key={index}
              controls
              autoPlay
              className="w-full h-full rounded"
              onError={() => handleVideoError(item.url)}
            >
              <source src={item.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image
              src={item.url}
              alt={`Preview media ${index + 1}`}
              key={index}
              width={800}
              height={0}
              priority
              className="w-full object-cover md:rounded"
              onClick={(e) => {
                if (!isSwiping) {
                  e.stopPropagation();
                }
              }}
            />
          ),
        )}
      </Carousel>
    </div>
  );
};

export default RenderMedia;
