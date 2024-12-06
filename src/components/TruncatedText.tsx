"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
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
        <Link
          href={text}
          target="_blank"
          className={cn(
            `${isExpanded ? "" : "line-clamp-1"} break-words w-full text-blue-500 underline`,
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {formatURL(text)}
        </Link>
      ) : (
        <div
          ref={textRef}
          className={cn(
            `${isExpanded ? "" : "line-clamp-2"} relative break-words w-full whitespace-pre-wrap`,
            className,
          )}
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: isExpanded ? undefined : 2,
            overflow: isExpanded ? "visible" : "hidden",
            wordBreak: "break-word", // Évite la coupure des mots
            overflowWrap: "break-word",
          }}
        >
          {text}
          {!isExpanded && isOverflowing && (
            <button
              onClick={(e) => {
                toggleText();
                e.stopPropagation();
              }}
              className="absolute bottom-0 right-0 bg-muted md:bg-transparent"
              style={{
                WebkitBoxOrient: "vertical",
              }}
            >
              <span className="text-eventoPink underline ">Read More</span>
            </button>
          )}
        </div>
      )}
      {isExpanded && (
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              toggleText();
              e.stopPropagation();
            }}
            className="text-eventoPink underline"
          >
            Read Less
          </button>
        </div>
      )}
    </div>
  );
};

export default TruncatedText;
