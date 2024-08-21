"use client";
import { useState } from "react";
import Search from "./Search";
import Filter from "./Filter";
import Tabbar from "./Tabs";
import LocationSelector from "../map/LocationSelector";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import apiService from "@/lib/apiService";
import { API } from "@/constants";
import FilterIcon from "../icons/FilterIcon";
import EventFilterModal from "./FilterBackup";

const HomeContainer = () => {
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState({});
  const [eventType, setEventType] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);

  // Start onclick model
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const openModal = (type: any) => {
    setModalType(type);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setModalType(null);
  };
  // End onclick model

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
          <Button
            isIconOnly
            variant="light"
            onClick={() => openModal("Fillter")}
          >
            <FilterIcon />
          </Button>
          {/* <Filter
            onFilterChange={handleFilterChange}
            visible={filterVisible}
            initialVisible={true}
          /> */}
        </div>
        <div>
          {isOpen && (
            <Modal
              isOpen={isOpen}
              onOpenChange={setIsOpen}
              size="full"
              scrollBehavior="inside"
              placement="top-center"
              className="min-h-full"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    {modalType === "Fillter" && (
                      <>
                        {/* <ModalHeader className="flex flex-col gap-1 text-center">Interest List</ModalHeader> */}
                        <ModalBody>
                          <Filter />
                        </ModalBody>
                      </>
                    )}
                  </>
                )}
              </ModalContent>
            </Modal>
          )}
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
