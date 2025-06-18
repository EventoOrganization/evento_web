import SmartImage from "@/components/SmartImage";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

type Props = {
  mediaFiles: File[];
};

const CreateEventCarousel = ({ mediaFiles }: Props) => {
  const [isSwiping, setIsSwiping] = useState(false);
  const [medias, setMedias] = useState(mediaFiles);
  useEffect(() => {
    setMedias(mediaFiles);
  }, [mediaFiles]);
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

  if (!medias.length) {
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
        infiniteLoop={true}
        emulateTouch={true}
        useKeyboardArrows={true}
      >
        {medias.map((file, index) => {
          const url = URL.createObjectURL(file);
          if (file.type.startsWith("video/")) {
            return (
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
                  src={url}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          }
          return (
            <div
              key={index}
              className="relative w-full flex justify-center rounded"
              onClick={(e) => {
                if (!isSwiping) {
                  e.stopPropagation();
                }
              }}
            >
              <img
                src={url}
                alt={`Preview media ${index + 1}`}
                className="object-contain h-fit w-full "
              />
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default CreateEventCarousel;
