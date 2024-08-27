"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useEventStore } from "@/store/useEventStore";
import { Option } from "@/types/EventType";
import { useState } from "react";
import Select, { MultiValue, StylesConfig } from "react-select";

const EventInterestSelect = ({ interests }: { interests: Option[] }) => {
  const eventStore = useEventStore();
  const options = interests;
  const [selectedInterests, setSelectedInterests] = useState<
    MultiValue<Option>
  >([]);
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
    eventStore.setEventField("interests", selectedOptions);
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
              instanceId={"interests"}
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
