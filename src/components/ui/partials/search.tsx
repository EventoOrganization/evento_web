function Search() {
  return (
    <>
      <div className="flex items-center bg-white mt-4 p-3 rounded-md">
        <svg
          className="h-6 w-6 text-purple-500 mr-2 flex-shrink-0"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <circle cx="10" cy="10" r="7" />
          <line x1="21" y1="21" x2="15" y2="15" />
        </svg>
        <input
          type="text"
          placeholder="Search for event"
          className="font-normal flex-1 border-none outline-none focus:border-none focus:ring-0"
        />
        <svg
          className="h-5 w-5 text-slate-500 ml-2 flex-shrink-0"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <circle cx="14" cy="6" r="2" />
          <line x1="4" y1="6" x2="12" y2="6" />
          <line x1="16" y1="6" x2="20" y2="6" />
          <circle cx="8" cy="12" r="2" />
          <line x1="4" y1="12" x2="6" y2="12" />
          <line x1="10" y1="12" x2="20" y2="12" />
          <circle cx="17" cy="18" r="2" />
          <line x1="4" y1="18" x2="15" y2="18" />
          <line x1="19" y1="18" x2="20" y2="18" />
        </svg>
      </div>
    </>
  );
}

export default Search;
