// components/Search
"use client";
import { useState } from "react";
import { useDebounce } from "react-use";
import { Input } from "@nextui-org/react";
import { UseDebounceReturn } from "react-use/lib/useDebounce";

interface SearchProps {
  onSearch: (query: string) => void;
}
const Search = ({ onSearch }: SearchProps) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(() => query, 500);
  const buildSearchParams = () => {
    const params = new URLSearchParams();
    //params.append("query", debouncedQuery);
    setQuery(query);
    return params.toString(); // Convert the URLSearchParams object to a toString
  };
  const handleSearch = async () => {
    const searchParams = buildSearchParams();
    onSearch(searchParams);
  };

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
      <Input
        type="search"
        placeholder="Search for event"
        className="font-normal flex-1 border-none outline-none focus:border-none focus:ring-0"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
    </>
  );
};
export default Search;
