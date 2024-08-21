// components/event/Filter.tsx
"use client";
import { useState, useEffect } from "react";
import apiService from "@/lib/apiService";
import { API } from "@/constants";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Input,
  Select,
} from "@nextui-org/react";
import React from "react";

interface FilterProps {
  onFilterChange: (filter: any) => void;
  visible: boolean;
  initialVisible: boolean;
}

interface Filter {
  interest: string[];
  eventDate: string;
}

interface Interest {
  _id: number;
  name: string;
}

const EventFilterModal = ({
  onFilterChange,
  visible: initialVisible,
}: FilterProps) => {
  const [visible, setVisible] = useState(initialVisible);
  const [filter, setFilter] = useState<Filter>({
    interest: [],
    eventDate: "",
  });
  const [interests, setInterests] = useState<Interest[]>([]);

  useEffect(() => {
    const fetchInterests = async () => {
      const response: any = await apiService.get(API.getInterestListing);
      const data = await response.body;
      setInterests(data);
    };
    fetchInterests();
  }, []);

  const handleFilterChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };

  const handleInterestChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedInterest = event.target.value;
    setFilter((prevFilter) => ({
      ...prevFilter,
      interest: [selectedInterest],
    }));
  };

  const handleEventDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const eventDate = event.target.value;
    setFilter((prevFilter) => ({ ...prevFilter, eventDate }));
  };

  const handleApplyFilter = () => {
    // Apply the filter to the events
    onFilterChange(filter);
    setVisible(false);
  };

  return (
    <Modal>
      <ModalContent>
        <ModalHeader>
          <h2 id="event-filter-modal">Event Filter</h2>
        </ModalHeader>
        <ModalBody>
          <form>
            <Select
              label="Interest"
              name="interest"
              value={filter.interest}
              onChange={handleInterestChange}
            >
              <option value="">Select Interest</option>
              <React.Fragment>
                {interests.map((interest) => (
                  <option key={interest._id} value={interest.name}>
                    {interest.name}
                  </option>
                ))}
              </React.Fragment>
            </Select>
            <Input
              label="Event Date"
              name="eventDate"
              value={filter.eventDate}
              onChange={handleEventDateChange}
              type="date"
            />
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="warning" onClick={() => setVisible(false)}>
            Cancel
          </Button>
          <Button onClick={handleApplyFilter}>Apply Filter</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EventFilterModal;
