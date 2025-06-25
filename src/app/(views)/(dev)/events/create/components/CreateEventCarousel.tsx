import SmartImage from "@/components/SmartImage";
import { cn } from "@/lib/utils";
import { PresetMedia } from "@/types/EventType";
import { useRef, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

type Props = {
  mediaFiles: File[];
  presetMedia?: PresetMedia[];
};

const CreateEventCarousel = ({ mediaFiles, presetMedia = [] }: Props) => {
  const allMedia = [
    ...mediaFiles.map((file) => ({
      type: "blob" as const,
      url: URL.createObjectURL(file),
      file,
    })),
    ...presetMedia.map((media) => ({
      type: "preset" as const,
      url: media.url,
      key: media.key,
    })),
  ];

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

  if (allMedia.length === 0) {
    return (
      <div className="relative w-full h-full bg-evento-gradient rounded">
        <SmartImage
          src="https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com/evento-bg.jpg"
          alt="Evento standard background"
          height={500}
          width={500}
          className={cn({
            "opacity-20 w-full": true,
          })}
          priority
        />
      </div>
    );
  }

  return (
    <div
      className="relative w-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Carousel
        showThumbs={false}
        dynamicHeight={true}
        infiniteLoop
        emulateTouch
        useKeyboardArrows
      >
        {allMedia.map((media, index) => {
          const isVideo =
            media.type === "blob" && media.file?.type?.startsWith("video/");
          return (
            <div
              key={index}
              className="relative w-full flex justify-center rounded"
              onClick={(e) => {
                if (!isSwiping) e.stopPropagation();
              }}
            >
              {isVideo ? (
                <video
                  controls
                  src={media.url}
                  className="w-full h-auto rounded object-cover"
                />
              ) : (
                <img
                  src={media.url}
                  alt={`Preview ${index}`}
                  className="object-contain h-fit w-full"
                />
              )}
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default CreateEventCarousel;
