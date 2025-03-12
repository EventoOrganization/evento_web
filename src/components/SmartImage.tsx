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
  loading = "lazy",
  style = {},
}: Props) => {
  const [useFallback, setUseFallback] = useState(forceImg);

  useEffect(() => {
    if (!useFallback) {
      fetch(src, { method: "HEAD" })
        .then((res) => {
          if (res.status === 402) {
            setUseFallback(true); // 🔥 Si quota dépassé, fallback sur <img>
          }
        })
        .catch(() => setUseFallback(true));
    }
  }, [src, useFallback]);

  if (useFallback) {
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
      width={width}
      height={height}
      className={className}
      style={style}
      {...(priority && { priority: true })}
      {...(fill && { fill: true })}
      {...(loading && { loading })}
    />
  );
};

export default SmartImage;
