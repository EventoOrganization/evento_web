export default function Address() {
  return (
    <>
      <div className="font-bold text-slate-400">Current Location</div>
      <div className="flex">
        <span>
          <svg
            className="h-6 w-6 text-fuchsia-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            {" "}
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />{" "}
            <circle cx="12" cy="10" r="3" />
          </svg>
        </span>
        <span className="font-bold ml-2">
          196 Nguyen Van Huong Ho Chi Minh City, 700000
        </span>
      </div>
    </>
  );
}
