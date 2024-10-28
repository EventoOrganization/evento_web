"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const TruncatedText = ({
  text = "",
  className,
  expand = false,
}: {
  text: string;
  expand?: boolean;
  className?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(expand);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (textRef.current) {
      const overflow =
        textRef.current.scrollHeight > textRef.current.clientHeight;
      // console.log(
      //   `scrollHeight: ${textRef.current.scrollHeight}, clientHeight: ${textRef.current.clientHeight}, text length: ${text.length}`,
      // );

      setIsOverflowing(overflow && text.length > 155);
    }
  }, [text]);
  const toggleText = () => setIsExpanded(!isExpanded);

  return (
    <div className="text-sm w-full mb-2">
      <p
        ref={textRef}
        className={cn(
          `${isExpanded ? "" : "line-clamp-2"} p-4 break-words w-full  whitespace-pre-wrap`,
          className,
        )}
        style={{ display: "-webkit-box", WebkitBoxOrient: "vertical" }}
      >
        {text}
      </p>
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
