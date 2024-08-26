"use client";
import { useEffect, useRef, useState } from "react";

const TruncatedText = ({ text = "" }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (textRef.current) {
      // Compare the scrollHeight (actual height with overflow) with the clientHeight (visible height)
      setIsOverflowing(
        textRef.current.scrollHeight > textRef.current.clientHeight,
      );
    }
  }, [text]);
  const toggleText = () => setIsExpanded(!isExpanded);

  return (
    <div className=" p-4 text-sm w-full">
      <p
        ref={textRef}
        className={`${isExpanded ? "" : "line-clamp-2"} break-words w-full whitespace-normal`}
        style={{ display: "-webkit-box", WebkitBoxOrient: "vertical" }}
      >
        {text}
      </p>
      {isOverflowing && (
        <div className="w-full flex justify-end items-start">
          <button onClick={toggleText} className="text-blue-500 underline">
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TruncatedText;
