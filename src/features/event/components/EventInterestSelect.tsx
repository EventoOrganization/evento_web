"use client";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { useEventStore } from "@/store/useEventStore";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
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
  const { register } = useFormContext();
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<
    MultiValue<Option>
  >(
    eventStore.interestId?.map((id) => ({
      value: id,
      label: "",
    })) as MultiValue<Option>,
  );

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

          // Update the labels of selected interests if necessary
          setSelectedInterests((currentSelected: MultiValue<Option>) =>
            currentSelected.map((selected: Option) => ({
              ...selected,
              label:
                mappedOptions.find((opt) => opt.value === selected.value)
                  ?.label || selected.label,
            })),
          );
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching interests:", error);
      }
    };
    fetchInterests();
  }, []);
  // Custom styles for react-select
  const customStyles: StylesConfig<Option, true> = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "white", // Customize background color
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
      backgroundColor: "#7858C3", // Customize selected option background
      color: "#fff",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#fff", // Customize selected option text color
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#fff", // Customize remove icon color
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
  );
};

export default EventInterestSelect;
