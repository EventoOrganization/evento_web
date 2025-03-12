"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (!useFallback && !forceImg) {
      fetch(src, { method: "HEAD" })
        .then((res) => {
          if (res.status === 402) {
            console.log("❌ Quota dépassé, fallback sur <img>", src);
            setUseFallback(true);
          } else if (!res.ok) {
            console.log("⚠️ Problème avec l'image, fallback sur <img>", src);
            setUseFallback(true);
          } else {
            console.log("✅ Image valide, utilisation de Next.js Image", src);
          }
        })
        .catch((error) => {
          console.error("⚠️ Fetch error, fallback sur <img>:", error);
          setUseFallback(true);
        });
    }
  }, [src, useFallback]);

  if (useFallback || forceImg) {
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
      {...(!fill && { width: width })}
      {...(!fill && { height: height })}
      className={className}
      style={style}
      {...(priority && { priority: true })}
      {...(fill && { fill: true })}
      {...(loading && { loading })}
    />
  );
};

export default SmartImage;
