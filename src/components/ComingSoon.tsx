import { cn } from "@/lib/utils";
import React from "react";

type ComingSoonProps = {
  message?: string;
  className?: string;
};

const ComingSoon: React.FC<ComingSoonProps> = ({ message, className }) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground",
        className,
      )}
    >
      <h2>Coming Soon</h2>
      <p className=" mt-2">
        {message || "This page is under construction. Please check back later!"}
      </p>
      <div className="mt-4">
        <svg
          className="max-w-12 max-h-12 w-full h-full text-gray-300 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default ComingSoon;
