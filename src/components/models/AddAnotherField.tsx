import React, { useState } from "react";
import {
  Switch,
  Textarea,
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Radio,
  RadioGroup,
  Link,
} from "@nextui-org/react";
import { Tab, Tabs } from "@nextui-org/tabs";
import XIcon from "../icons/XIcon";

export default function AddAnotherField() {
  const [showContent, setShowContent] = useState(false);

  const toggleContent = () => {
    setShowContent(!showContent);
  };

  const [options, setOptions] = useState([
    { id: 1, value: "public", placeholder: "Enter your open choice" },
    { id: 2, value: "public", placeholder: "Enter your open choice" },
  ]);

  const addOption = () => {
    const newOption = {
      id: options.length + 1,
      value: "public",
      placeholder: "Enter your open choice",
    };
    setOptions([...options, newOption]);
  };

  const removeOption = (id: number) => {
    setOptions(options.filter((option) => option.id !== id));
  };

  return (
    <>
      <div className="w-full">
        <div className="mt-5 font-bold text-xl text-fuchsia-700">
          Add another field
        </div>
        <div className="my-3 flex items-center space-x-3">
          <div className="flex-grow">
            <Textarea
              labelPlacement="outside"
              placeholder='Enter your question (e.g., "Which part of the event will you attend?")'
              size="sm"
              classNames={{
                input: "resize-y min-h-[50px]",
              }}
            />
          </div>
          <div className="flex-none">
            <XIcon />
          </div>
        </div>
        <div className="flex items-center justify-end my-3">
          <span className="font-bold mr-5">Required?</span>
          <Switch id="toggle-switch" defaultSelected />
        </div>
        <div className="my-3 w-48">
          <Button onPress={toggleContent} className="mb-4">
            {showContent ? "Multiple choice" : "Open text"}
          </Button>
        </div>
        {showContent ? (
          <>
            {options.map((option) => (
              <div key={option.id} className="my-3 flex items-center space-x-3">
                <div className="flex-none">
                  <RadioGroup>
                    <Radio value={option.value}></Radio>
                  </RadioGroup>
                </div>
                <div className="flex-grow">
                  <Input
                    key="outside"
                    type="text"
                    placeholder={option.placeholder}
                    size="lg"
                  />
                </div>
                <div className="flex-none">
                  <div onClick={() => removeOption(option.id)}>
                    <XIcon />
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-10">
              <Link
                className="text-lg font-bold text-fuchsia-700"
                onClick={addOption}
              >
                + Add other options
              </Link>
            </div>
          </>
        ) : (
          <div>
            <Textarea
              labelPlacement="outside"
              placeholder="Open text field"
              size="lg"
              classNames={{
                input: "resize-y min-h-[10em]",
              }}
            />
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <Button
          radius="full"
          className="text-white shadow-lg px-8 text-sm mr-10"
          size="lg"
        >
          Cancel
        </Button>
        <Button
          radius="full"
          className="bg-gradient-to-tr from-pink-500 to-blue-500 text-white shadow-lg px-10 text-sm"
          size="lg"
        >
          Submit
        </Button>
      </div>
    </>
  );
}
