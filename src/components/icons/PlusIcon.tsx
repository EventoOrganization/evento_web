import React from "react";

export default function PlusIcon() {
  return (
    <>
      <svg
        className="h-6 w-6 text-gray-500"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        {" "}
        <path stroke="none" d="M0 0h24v24H0z" />{" "}
        <line x1="12" y1="5" x2="12" y2="19" />{" "}
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </>
  );
}
