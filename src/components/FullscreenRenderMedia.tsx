import { EventType } from "@/types/EventType";
import { cn } from "@nextui-org/theme";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const FullscreenRenderMedia = ({ event }: { event: EventType }) => {
  const mediaItems: string[] = [];
  const [isSwiping, setIsSwiping] = useState(false);
  const [portraitStates, setPortraitStates] = useState<boolean[]>([]); // Manage portrait state for multiple media items
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

  useEffect(() => {
    // Check if media items are portrait or landscape
    const checkPortraitStates = async () => {
      const portraitFlags = await Promise.all(
        mediaItems.map((mediaUrl) => {
          return new Promise<boolean>((resolve) => {
            const img = new window.Image();
            img.src = mediaUrl;
            img.onload = () => {
              resolve(img.naturalHeight > img.naturalWidth);
            };
          });
        }),
      );
      setPortraitStates(portraitFlags);
    };

    if (mediaItems.length > 0) {
      checkPortraitStates();
    }
  }, [mediaItems]);

  return (
    <div
      className="w-full h-full"
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
        className="h-full"
      >
        {mediaItems.map((item, index) =>
          isValidUrl(item) && item.endsWith(".mp4") ? (
            <div
              key={index}
              className="relative w-full h-full"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                if (!isSwiping) {
                  e.stopPropagation();
                }
              }}
            >
              <video
                controls
                className={cn(
                  "absolute top-0 left-0 w-full h-full",
                  portraitStates[index] ? "object-contain" : "object-cover",
                )}
              >
                <source src={item} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div
              key={index}
              className="relative w-full h-full"
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
                  "h-full",
                  portraitStates[index] ? "object-contain" : "object-cover",
                  { "opacity-20": !event },
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

export default FullscreenRenderMedia;
