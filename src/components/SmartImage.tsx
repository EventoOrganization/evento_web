"use client";
import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  forceImg?: boolean; // 👈 Intentionnel : on veut une <img>
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
  const [useFallback, setUseFallback] = useState(false); // 👈 Indépendant de forceImg

  // 🔹 Si `forceImg` est activé → on ne tente même pas d'afficher Next.js Image
  if (forceImg) {
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

  // 🔹 Si `useFallback` est activé → on utilise une <img> car Next.js a échoué
  if (useFallback) {
    console.warn("⚠️ Fallback sur <img> après erreur :", src);
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

  // 🔹 Sinon, on tente de charger avec Next.js Image
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
        console.error("❌ Next.js Image échouée, fallback sur <img> :", src);
        setUseFallback(true);
      }}
    />
  );
};

export default SmartImage;
