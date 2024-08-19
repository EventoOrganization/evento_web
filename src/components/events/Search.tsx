// components/Search
"use client";
import { useState } from "react";
import { useDebounce } from "react-use";
import { Input } from "@nextui-org/react";
import apiService from "@/lib/apiService";
import { API } from "@/constants";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(() => searchQuery, 500);
  const buildSearchParams = () => {
    const params = new URLSearchParams();
    params.append("query", debouncedSearchQuery.current);
    return params.toString(); // Convert the URLSearchParams object to a toString
  };
  const handleSearch = async () => {
    const searchParams = buildSearchParams();
    // Make an API call or perform some other search action
    const res = await apiService.post(
      API.allAndVirtualEventAndNear,
      searchParams,
    );
  };

  return (
    <>
      <div className="flex items-center bg-white mt-4 p-3 rounded-md">
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
        <Input
          type="search"
          placeholder="Search for event"
          className="font-normal flex-1 border-none outline-none focus:border-none focus:ring-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <svg
          className="h-5 w-5 text-slate-500 ml-2 flex-shrink-0"
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
};
export default Search;
