"use client";
import { EventType } from "@/types/EventType";
import { useRef, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import SmartImage from "./SmartImage";

const RenderMedia = ({ event }: { event: EventType }) => {
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

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="relative w-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={(e) => {
        handleTouchEnd();
        // ⚠️ Si le touch s’est terminé sans swipe → autoriser le click
        if (!isSwiping) {
          e.stopPropagation();
        }
      }}
      onClick={(e) => {
        // Empêche uniquement si c’est un faux click hors interactions
        if (!isSwiping) {
          e.stopPropagation();
        }
      }}
    >
      <Carousel
        showThumbs={false}
        dynamicHeight={true}
        infiniteLoop
        emulateTouch
        useKeyboardArrows
      >
        {event.initialMedia.map(
          (item, index) =>
            item &&
            (item.type === "video" ? (
              <video
                key={index}
                controls
                autoPlay
                className="w-full h-auto max-h-screen rounded"
              >
                <source src={item.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <SmartImage
                src={item.url}
                alt={`Preview media ${index + 1}`}
                key={index}
                width={800}
                height={0}
                priority
                className="w-full object-cover max-h-screen md:rounded"
              />
            )),
        )}
      </Carousel>
    </div>
  );
};

export default RenderMedia;
