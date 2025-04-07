"use client";
import { MediaItem } from "@/store/useCreateEventStore";
import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string | MediaItem;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  forceImg?: boolean; // 👈 Intentionnel : on veut une <img>
  priority?: boolean;
  fill?: boolean;
  loading?: "lazy" | "eager";
  style?: React.CSSProperties;
  onClick?: (
    event: React.MouseEvent<HTMLImageElement | HTMLDivElement>,
  ) => void;
};

const SmartImage = ({
  src,
  alt,
  width = 200,
  height = 200,
  className,
  forceImg = false,
  priority = false,
  fill = false,
  loading,
  style = {},
  onClick,
}: Props) => {
  const [useFallback, setUseFallback] = useState(false); // 👈 Indépendant de forceImg
  const resolveSmartSrc = (): string => {
    if (typeof src === "string") return src;

    const maxSize = Math.max(width, height);

    if (maxSize <= 300 && src.thumbnailUrl) return src.thumbnailUrl;
    if (maxSize <= 800 && src.mediumUrl) return src.mediumUrl;

    return src.url; // fallback full size
  };

  const resolvedSrc = resolveSmartSrc();
  // 🔹 Si `forceImg` est activé → on ne tente même pas d'afficher Next.js Image
  if (forceImg) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={resolvedSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
        {...(loading && { loading })}
        onClick={onClick}
      />
    );
  }

  // 🔹 Si `useFallback` est activé → on utilise une <img> car Next.js a échoué
  if (useFallback) {
    console.warn("⚠️ Fallback sur <img> après erreur :", src);
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={resolvedSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
        onClick={onClick}
        {...(loading && { loading })}
      />
    );
  }

  // 🔹 Sinon, on tente de charger avec Next.js Image
  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      {...(!fill && { width })}
      {...(!fill && { height })}
      className={className}
      style={style}
      {...(priority && { priority: true })}
      {...(fill && { fill: true })}
      {...(loading && { loading })}
      onClick={onClick}
      onError={() => {
        console.error("❌ Next.js Image échouée, fallback sur <img> :", src);
        setUseFallback(true);
      }}
    />
  );
};

export default SmartImage;
