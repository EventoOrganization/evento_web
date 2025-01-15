"use client";
import { EventType } from "@/types/EventType";
import heic2any from "heic2any";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const RenderMedia = ({ event }: { event: EventType }) => {
  const [processedMedia, setProcessedMedia] = useState<
    { url: string; type: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef(0);

  const convertHeicToJpeg = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch the file. Status: ${response.status}`);
      }

      const blob = await response.blob();
      if (blob.type === "image/heic" || url.toLowerCase().endsWith(".heic")) {
        const jpegBlob = await heic2any({ blob, toType: "image/jpeg" });
        const convertedBlob = Array.isArray(jpegBlob) ? jpegBlob[0] : jpegBlob;
        return URL.createObjectURL(convertedBlob);
      }

      return url;
    } catch {
      return url; // Retourne l'URL d'origine en cas d'erreur
    }
  };

  useEffect(() => {
    const processMedia = async () => {
      const initialMedias = event?.initialMedia || [];
      const processed = await Promise.all(
        initialMedias.map(async (item) => {
          if (
            item.type === "image" &&
            item.url.toLowerCase().endsWith(".heic")
          ) {
            const convertedUrl = await convertHeicToJpeg(item.url);
            return { url: convertedUrl, type: "image" };
          }
          return item;
        }),
      );
      setProcessedMedia(processed);
      setIsLoading(false);
    };

    processMedia();
  }, [event]);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-500">Loading media...</p>
      </div>
    );
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      className="h-full"
    >
      <Carousel
        showThumbs={false}
        dynamicHeight={false}
        infiniteLoop={true}
        emulateTouch={true}
        useKeyboardArrows={true}
        className="relative"
      >
        {processedMedia.map((item, index) =>
          item.type === "video" ? (
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
            <Image
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
          ),
        )}
      </Carousel>
    </div>
  );
};

export default RenderMedia;
