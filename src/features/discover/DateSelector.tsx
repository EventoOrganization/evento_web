import { Input } from "@/components/ui/input";
import { useState } from "react";
const DateSelector = ({ selectedDate, setSelectedDate }: any) => {
  const [isDateInputVisible, setIsDateInputVisible] = useState(false);

  const handleLabelClick = () => {
    setIsDateInputVisible(true);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setIsDateInputVisible(false);
  };

  return (
    <div className="flex items-center gap-2 ">
      <span
        className="cursor-pointer text-purple-600 font-bold"
        onClick={handleLabelClick}
      >
        Date
      </span>
      {!isDateInputVisible ? (
        <span className="cursor-pointer" onClick={handleLabelClick}>
          {selectedDate ? selectedDate : "All"}
        </span>
      ) : (
        <Input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="border p-2"
          placeholder="All"
        />
      )}
    </div>
  );
};

export default DateSelector;
