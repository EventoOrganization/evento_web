"use client";
import { OptionType } from "@/types/EventType";
import { useState } from "react";
import Select, { MultiValue, StylesConfig } from "react-select";
import { Label } from "./ui/label";

const Selector = ({ options }: { options?: any[] }) => {
  const [selectedInterests, setSelectedInterests] = useState<
    MultiValue<OptionType>
  >([]);

  // Transformation des options
  const transformedOptions = transformOptions(options || []);

  // Styles personnalisés pour react-select
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
  };

  return (
    <>
      <Label htmlFor="interests">Interests</Label>
      <Select
        isMulti
        instanceId={"interests"}
        value={selectedInterests}
        options={transformedOptions} // Utilisation des options transformées
        onChange={handleChange}
        placeholder="Select Interests..."
        className="react-select-container"
        classNamePrefix="react-select"
        styles={customStyles}
        menuPlacement="top"
      />
      {selectedInterests.length > 0 && (
        <p className="text-xs text-gray-500">
          {selectedInterests.length} selected
        </p>
      )}
    </>
  );
};

export default Selector;

const transformOptions = (interests: any[]): OptionType[] => {
  return interests.map((interest) => ({
    label: interest.name,
    value: interest._id,
  }));
};
