"use client";
import { useEventStore } from "@/store/useEventStore";
import { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
// Type pour représenter une option dans le select
type Option = {
  value: string;
  label: string;
};

// Type pour les données d'intérêt récupérées depuis l'API
type Interest = {
  _id: string;
  name: string;
};

const InterestSelector = () => {
  const eventStore = useEventStore();
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
    // Fetch des intérêts depuis l'API
    console.log("Options before fetch:", options);
    const fetchInterests = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/getInterestsListing`,
        );
        const result = await response.json();
        const data: Interest[] = result.body;
        console.log("Fetched data:", data);
        // Vérifiez que `data` est un tableau
        if (Array.isArray(data)) {
          const mappedOptions = data.map((interest) => ({
            value: interest._id,
            label: interest.name,
          }));
          console.log("Mapped options:", mappedOptions);
          // Mettre à jour les options dans l'état
          setOptions(mappedOptions);

          // Mettre à jour les labels des intérêts sélectionnés si nécessaires
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
  }, [options]);

  const handleChange = (selectedOptions: MultiValue<Option>) => {
    setSelectedInterests(selectedOptions);
    const interestIds = selectedOptions.map((option: Option) => option.value);
    eventStore.setEventField("interestId", interestIds);
  };

  return (
    <Select
      isMulti
      value={selectedInterests}
      options={options}
      onChange={handleChange}
      placeholder="Select Interests..."
      className="react-select-container"
      classNamePrefix="react-select"
    />
  );
};

export default InterestSelector;
