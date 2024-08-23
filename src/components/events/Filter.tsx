import React, { useState, useEffect } from "react";
import BackButton from "../ui/BackButton";
import { CheckboxGroup, Checkbox, DatePicker } from "@nextui-org/react";
import { parseDate, DateValue } from "@internationalized/date";
import CustomButton from "../ui/CustomButton";
import apiService from "@/lib/apiService";
import { API } from "@/constants";
//import { formatDate } from "@/utils/Helper";
import moment from "moment";

interface FilterProps {
  onFilterChange: (filter: Filter) => void;
  visible: boolean;
  initialVisible: boolean;
}

interface Filter {
  interestId: string;
  eventDate: string;
}

interface Interest {
  _id: string;
  name: string;
}

export default function Filter({ onFilterChange }: FilterProps) {
  const [selectedDate, setSelectedDate] = useState<DateValue>(
    parseDate(moment().format("YYYY-MM-DD")),
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  //const [visible, setVisible] = useState(false);
  const [interests, setInterests] = useState<Interest[]>([]);

  // const [filter, setFilter] = useState<Filter>({
  //   interestId: "",
  //   eventDate: moment(selectedDate).format("YYYY-MM-DD"),
  // });

  useEffect(() => {
    const fetchInterests = async () => {
      const response: any = await apiService.get(API.getInterestListing);
      const data = await response.body;
      setInterests(data);
    };
    fetchInterests();
  }, []);

  const handleApplyFilter = () => {
    // Apply the filter to the events
    const date = moment(selectedDate.toString()).format("YYYY-MM-DD");
    const interest = JSON.stringify(selectedInterests);
    const filterData = {
      interestId: interest,
      eventDate: date,
    };
    //setFilter(filterData);
    onFilterChange(filterData);
  };

  return (
    <>
      <div className="bg-white h-screen">
        <div className="p-1 w-full max-w-lg mx-auto">
          <div className="flex justify-start items-center mt-5">
            <div className="flex">
              <BackButton />
            </div>
            <div className="mx-auto font-bold p-3">
              <h1 className="text-3xl">Event Filter</h1>
            </div>
          </div>

          <div className="mt-10">
            <span className="text-md mb-1">Date</span>
            <DatePicker
              aria-label="Date"
              key="dp"
              size="lg"
              defaultValue={selectedDate}
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </div>

          <div className="mt-10">
            <span className="text-md mb-1">Interests</span>
            <div className="flex flex-wrap gap-3 items-center">
              <CheckboxGroup
                key="cbg"
                //label="Interests"
                orientation="horizontal"
                color="secondary"
                defaultValue={[]}
                value={selectedInterests}
                onValueChange={setSelectedInterests}
              >
                {interests.map((item) => (
                  <Checkbox
                    key={item._id}
                    value={item._id}
                    className="flex items-center cursor-pointer mt-2 ml-2 px-4 py-2 rounded-full border bg-white text-gray-800 border-gray-300"
                  >
                    {item.name}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </div>
          </div>

          <div className="mt-16">
            <div className="flex justify-center">
              <CustomButton
                onClick={handleApplyFilter}
                size="lg"
                radius="full"
                gradient
              >
                Apply
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
