export default function MessageIcon() {
  return (
    <>
      <svg
        className="h-6 w-6 text-gray-500"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {" "}
        <path stroke="none" d="M0 0h24v24H0z" />{" "}
        <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />{" "}
        <line x1="12" y1="12" x2="12" y2="12.01" />{" "}
        <line x1="8" y1="12" x2="8" y2="12.01" />{" "}
        <line x1="16" y1="12" x2="16" y2="12.01" />
      </svg>
    </>
  );
}
