// components/event/Filter.tsx
"use client";
import { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import apiService from "@/lib/apiService";
import { API } from "@/constants";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Input,
  Select,
} from "@nextui-org/react";

interface Filter {
  eventType: string[];
  interest: string[];
  distance: number;
  eventDate: string;
  keywords: string;
}

interface Interest {
  _id: number;
  name: string;
}

const EventFilterModal = () => {
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState<Filter>({
    eventType: [],
    interest: [],
    distance: 10,
    eventDate: "",
    keywords: "",
  });
  const [interests, setInterests] = useState<Interest[]>([]);

  useEffect(() => {
    const fetchInterests = async () => {
      const response: any = await apiService.get(API.getInterestListing);
      console.log(response);
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

  const handleEventTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedEventType = event.target.value;
    setFilter((prevFilter) => ({
      ...prevFilter,
      eventType: [selectedEventType],
    }));
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

  const handleDistanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const distance = parseInt(event.target.value, 10);
    setFilter((prevFilter) => ({ ...prevFilter, distance }));
  };

  const handleEventDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const eventDate = event.target.value;
    setFilter((prevFilter) => ({ ...prevFilter, eventDate }));
  };

  const handleKeywordsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keywords = event.target.value;
    setFilter((prevFilter) => ({ ...prevFilter, keywords }));
  };

  const handleApplyFilter = () => {
    // Apply the filter to the events
    console.log(filter);
    setVisible(false);
  };

  return (
    <Modal
      aria-labelledby="event-filter-modal"
      open={visible}
      onClose={() => setVisible(false)}
    >
      <ModalHeader>
        <h2 id="event-filter-modal">Event Filter</h2>
      </ModalHeader>
      <ModalBody>
        <form>
          <Select
            label="Event Type"
            name="eventType"
            value={filter.eventType}
            onChange={handleEventTypeChange}
          >
            <option value="">Select Event Type</option>
            <option value="concert">Concert</option>
            <option value="festival">Festival</option>
            <option value="sports">Sports</option>
          </Select>
          <Select
            label="Interest"
            name="interest"
            value={filter.interest}
            onChange={handleInterestChange}
          >
            <option value="">Select Interest</option>
            {interests.map((interest) => (
              <option key={interest._id} value={interest.name}>
                {interest.name}
              </option>
            ))}
          </Select>
          <Input
            label="Distance"
            name="distance"
            value={filter.distance}
            onChange={handleDistanceChange}
            type="number"
          />
          <Input
            label="Event Date"
            name="eventDate"
            value={filter.eventDate}
            onChange={handleEventDateChange}
            type="date"
          />
          <Input
            label="Keywords"
            name="keywords"
            value={filter.keywords}
            onChange={handleKeywordsChange}
            type="text"
          />
        </form>
      </ModalBody>
      <ModalFooter>
        <Button auto flat color="error" onClick={() => setVisible(false)}>
          Cancel
        </Button>
        <Button auto onClick={handleApplyFilter}>
          Apply Filter
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EventFilterModal;
