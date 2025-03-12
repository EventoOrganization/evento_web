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
  forceImg,
  priority = false,
  fill = false,
  loading = "lazy",
  style = {},
}: Props) => {
  const [useFallback, setUseFallback] = useState(false);

  if (forceImg) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
        {...(loading && { loading: loading })}
      />
    );
  }
  return useFallback ? (
    // 🔥 Si Next.js bloque l'image, on affiche une <img> classique
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      {...(loading && { loading: loading })}
    />
  ) : (
    // 🖼️ On essaye d'afficher l'image optimisée Next.js
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      onError={() => setUseFallback(true)} // 🔥 Si Next.js échoue, on change d'affichage
      {...(priority && { priority: true })}
      {...(fill && { fill: true })}
      {...(loading && { loading: loading })}
    />
  );
};

export default SmartImage;
