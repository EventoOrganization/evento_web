"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface TruncatedTextProps {
  text: string;
  expand?: boolean;
  className?: string;
  isLink?: boolean;
}

const TruncatedText = ({
  text = "",
  expand = false,
  className,
  isLink = false,
}: TruncatedTextProps) => {
  const [isExpanded, setIsExpanded] = useState(expand);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (textRef.current) {
      const overflow =
        textRef.current.scrollHeight > textRef.current.clientHeight;
      setIsOverflowing(overflow);
    }
  }, [text]);

  const toggleText = () => setIsExpanded(!isExpanded);

  // Fonction pour formater l'URL
  const formatURL = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      const domain = parsedUrl.hostname;
      const path = parsedUrl.pathname.split("/").slice(0, 2).join("/");

      // Afficher uniquement le domaine principal avec un niveau de chemin
      return `${domain}${path.length > 1 ? path : ""}`;
    } catch (error) {
      return url; // Retourner l'URL brute si elle n'est pas valide
    }
  };

  return (
    <div className="text-sm w-full mb-2">
      {isLink ? (
        <span
          ref={textRef}
          className={cn(
            `${isExpanded ? "" : "line-clamp-1"} break-words w-full text-blue-500 underline`,
            className,
          )}
        >
          {formatURL(text)}
        </span>
      ) : (
        <p
          ref={textRef}
          className={cn(
            `${isExpanded ? "" : "line-clamp-2"} break-words w-full whitespace-pre-wrap`,
            className,
          )}
          style={{ display: "-webkit-box", WebkitBoxOrient: "vertical" }}
        >
          {text}
        </p>
      )}
      {isOverflowing && (
        <div className="w-full flex justify-end items-start">
          <button
            onClick={(e) => {
              toggleText();
              e.stopPropagation();
            }}
            className="text-blue-500 underline"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TruncatedText;
