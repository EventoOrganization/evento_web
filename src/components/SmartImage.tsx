"use client";
import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  forceImg?: boolean;
  priority?: boolean;
  fill?: boolean;
  loading?: "lazy" | "eager";
  style?: React.CSSProperties;
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
}: Props) => {
  const [useFallback, setUseFallback] = useState(forceImg);

  if (useFallback || forceImg) {
    console.warn("⚠️ Affichage d'une <img> standard pour :", src);
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
        {...(loading && { loading })}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      {...(!fill && { width })}
      {...(!fill && { height })}
      className={className}
      style={style}
      {...(priority && { priority: true })}
      {...(fill && { fill: true })}
      {...(loading && { loading })}
      onError={() => {
        console.error("❌ Next.js ne peut pas charger l'image :", src);
        setUseFallback(true);
      }}
    />
  );
};

export default SmartImage;
