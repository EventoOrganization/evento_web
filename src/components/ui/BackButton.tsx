import React from "react";

export default function BackButton() {
  return (
    <>
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-blue-500">
        <svg
          className="h-5 w-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <line x1="19" y1="12" x2="5" y2="12" />{" "}
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </div>
    </>
  );
}
