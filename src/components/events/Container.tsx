"use client";
import { useState } from "react";
import Search from "./Search";
import Filter from "./Filter";
import Tabbar from "./Tabs";
import LocationSelector from "../map/LocationSelector";
import { Button } from "@nextui-org/react";
import apiService from "@/lib/apiService";
import { API } from "@/constants";

const HomeContainer = () => {
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState({});
  const [eventType, setEventType] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);

  const handleOpenFilter = () => {
    setFilterVisible(true);
  };
  console.log(location, query, filter, eventType);

  const handleLocation = (location: string) => {
    setLocation(location);
    getData();
  };
  const handleSearch = (query: string) => {
    setQuery(query);
    getData();
  };

  const handleFilterChange = (filter: any) => {
    setFilter(filter);
    getData();
  };

  const handleTabChange = (eventType: string) => {
    setEventType(eventType);
    getData();
  };

  const buildSearchParams = () => {
    const params = new URLSearchParams();
    params.append("query", query);
    return params.toString(); // Convert the URLSearchParams object to a toString
  };
  const getData = async () => {
    const searchParams = buildSearchParams();
    const res = await apiService.post(
      API.allAndVirtualEventAndNear,
      searchParams,
    );
    return res;
  };

  return (
    <>
      <div className="ml-1 mr-1">
        <LocationSelector onPicked={handleLocation} />
        <div className="flex items-center bg-white mt-4 p-3 rounded-md">
          <Search onSearch={handleSearch} />
          <Button isIconOnly variant="light" onClick={handleOpenFilter}>
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
          </Button>
          <Filter
            onFilterChange={handleFilterChange}
            visible={filterVisible}
            initialVisible={true}
          />
        </div>
      </div>
      <div className="m-1">
        {/* <Tabs onTabChange={handleEventTypeChange} /> */}
        <Tabbar onTabChange={handleTabChange} data={getData()} />
      </div>
    </>
  );
};

export default HomeContainer;
