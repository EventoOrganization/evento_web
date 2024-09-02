"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useEventStore } from "@/store/useEventStore";
import { OptionType } from "@/types/EventType";
import { useEffect, useState } from "react";
import Select, { MultiValue, StylesConfig } from "react-select";

const EventInterestSelect = ({ interests }: { interests: OptionType[] }) => {
  const eventStore = useEventStore();
  const options = interests;

  // Initialize selectedInterests from the store
  const [selectedInterests, setSelectedInterests] = useState<
    MultiValue<OptionType>
  >(eventStore.interests || []);

  // Synchronize the selectedInterests with the store when the component mounts
  useEffect(() => {
    if (eventStore.interests) {
      setSelectedInterests(eventStore.interests);
    }
  }, [eventStore.interests]);

  // Custom styles for react-select
  const customStyles: StylesConfig<OptionType, true> = {
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

  const handleChange = (selectedOptions: MultiValue<OptionType>) => {
    setSelectedInterests(selectedOptions);
    const interestIds = selectedOptions.map(
      (option: OptionType) => option.value,
    );
    eventStore.setEventField("interestId", interestIds);
    eventStore.setEventField("interests", selectedOptions);
  };

  return (
    <FormField
      name="interests"
      render={({}) => (
        <FormItem>
          <FormLabel className="sr-only">Event Interests</FormLabel>
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
