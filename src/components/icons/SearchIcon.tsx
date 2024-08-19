import React from 'react'

export default function SearchIcon() {
  return (
    <>
      <svg
        className="h-6 w-6 text-purple-500 mr-2 flex-shrink-0"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" />
        <circle cx="10" cy="10" r="7" />
        <line x1="21" y1="21" x2="15" y2="15" />
      </svg>
    </>
  )
}
