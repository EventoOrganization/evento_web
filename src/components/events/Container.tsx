"use client";
import { useState, useEffect } from "react";
import Search from "./Search";
import Filter from "./Filter";
import Tabbar from "./Tabs";
import LocationSelector from "../map/LocationSelector";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  //ModalHeader,
} from "@nextui-org/react";
import apiService from "@/lib/apiService";
import { API } from "@/constants";
import FilterIcon from "../icons/FilterIcon";
//import moment from "moment";
//import { get } from "http";
//import EventFilterModal from "./FilterBackup";

const HomeContainer = () => {
  const [data, setData] = useState(null);
  const [searchLocation, setSearchLocation] = useState({ lat: 0, lng: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState({
    eventDate: "",
    interestId: "",
  });
  const [searchEventType, setSearchEventType] = useState("1");
  //const [filterVisible, setFilterVisible] = useState(false);

  // Start onclick modal
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
  // End onclick modal

  const handleLocation = (searchLocation: { lat: number; lng: number }) => {
    //console.log(searchLocation.lat, searchLocation.lng);
    setSearchLocation(searchLocation);
  };
  const handleSearch = (searchQuery: string) => {
    setSearchQuery(searchQuery);
  };

  const handleFilterChange = (searchFilter: {
    eventDate: string;
    interestId: string;
  }) => {
    setSearchFilter(searchFilter);
    closeModal();
  };

  const handleTabChange = (searchEventType: string) => {
    setSearchEventType(searchEventType.toString());
  };

  useEffect(() => {
    const buildSearchParams = () => {
      //const params = new URLSearchParams();
      //params.append("search", searchQuery);
      //return params.toString(); // Convert the URLSearchParams object to a toString
      setSearchQuery;
      return searchQuery;
    };
    const getData = async () => {
      //const searchParams = buildSearchParams();
      //const { lat, lng } = searchLocation;
      const searchParams = {
        latitude: searchLocation.lat,
        longitude: searchLocation.lng,
        type: searchEventType,
        date: searchFilter.eventDate,
        interestId: searchFilter.interestId,
      };

      console.log(searchParams);

      const res: any = await apiService.post(
        `${API.allAndVirtualEventAndNear}/?search=${buildSearchParams()}`,
        searchParams,
      );
      //console.log(res.data);
      setData(res.data);
      return res.data;
    };
    getData();
  }, [searchLocation, searchQuery, searchFilter, searchEventType]);

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
                          <Filter
                            onFilterChange={handleFilterChange}
                            visible={false}
                            initialVisible={false}
                          />
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
        <Tabbar onTabChange={handleTabChange} data={data} />
      </div>
    </>
  );
};

export default HomeContainer;
