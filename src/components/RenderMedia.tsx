"use client";
import { EventType } from "@/types/EventType";
import { cn } from "@nextui-org/theme";
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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      className="h-full"
    >
      {event.initialMedia.length > 0 ? (
        <Carousel
          showThumbs={false}
          dynamicHeight={false}
          infiniteLoop={true}
          emulateTouch={true}
          useKeyboardArrows={true}
          className="relative"
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
                  onClick={(e) => {
                    if (!isSwiping) {
                      e.stopPropagation();
                    }
                  }}
                />
              )),
          )}
        </Carousel>
      ) : (
        <div className="w-full bg-evento-gradient rounded">
          <SmartImage
            src="https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com/evento-bg.jpg"
            alt="Evento standard background"
            height={500}
            width={500}
            className={cn("opacity-20 w-full object-cover")}
            priority
          />
        </div>
      )}
    </div>
  );
};

export default RenderMedia;
