"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useEventStore } from "@/store/useEventStore";
import { useEffect, useState } from "react";
import Select, { MultiValue, StylesConfig } from "react-select";

// Type to represent an option in the select
type Option = {
  value: string;
  label: string;
};

// Type for the interest data fetched from the API
type Interest = {
  _id: string;
  name: string;
};

const EventInterestSelect = () => {
  const eventStore = useEventStore();
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<
    MultiValue<Option>
  >([]);

  useEffect(() => {
    // Fetch interests from the API
    const fetchInterests = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/getInterestsListing`,
        );
        const result = await response.json();
        const data: Interest[] = result.body;

        if (Array.isArray(data)) {
          const mappedOptions = data.map((interest) => ({
            value: interest._id,
            label: interest.name,
          }));

          setOptions(mappedOptions);

          // Update selectedInterests with proper labels
          const initialSelectedInterests = (eventStore.interestId || []).map(
            (id) => {
              const matchedOption = mappedOptions.find(
                (opt) => opt.value === id,
              );
              return matchedOption
                ? { value: id, label: matchedOption.label }
                : { value: id, label: "" };
            },
          );
          setSelectedInterests(initialSelectedInterests as MultiValue<Option>);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching interests:", error);
      }
    };

    fetchInterests();
  }, [eventStore.interestId]);

  // Custom styles for react-select
  const customStyles: StylesConfig<Option, true> = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "white",
      minHeight: "40px",
      boxShadow: "none",
      borderRadius: "10px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#7858C3"
        : state.isFocused
          ? "#ddd"
          : "#fff",
    }),
    multiValue: (provided) => ({
      ...provided,
      borderRadius: "6px",
      backgroundColor: "#7858C3",
      color: "#fff",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#fff",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#fff",
      ":hover": {
        backgroundColor: "#FF4949",
        color: "#fff",
      },
    }),
  };

  const handleChange = (selectedOptions: MultiValue<Option>) => {
    setSelectedInterests(selectedOptions);
    const interestIds = selectedOptions.map((option: Option) => option.value);
    eventStore.setEventField("interestId", interestIds);
  };

  return (
    <FormField
      name="interests"
      render={({}) => (
        <FormItem>
          <FormLabel className="sr-only">Event Type</FormLabel>
          <FormControl>
            <Select
              isMulti
              value={selectedInterests}
              options={options}
              onChange={handleChange}
              placeholder="Select Interests..."
              className="react-select-container"
              classNamePrefix="react-select"
              styles={customStyles}
              menuPlacement="top" // Open dropdown upwards
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default EventInterestSelect;