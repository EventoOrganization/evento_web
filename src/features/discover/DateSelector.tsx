import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateSelector = ({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}) => {
  const [showReset, setShowReset] = useState(false);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const localDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60000,
      );
      setSelectedDate(localDate);
    } else {
      setSelectedDate(null);
    }
    setShowReset(!!date);
  };

  const resetDate = () => {
    setSelectedDate(null);
    setShowReset(false);
  };

  return (
    <div className="relative flex items-center gap-2">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        placeholderText="Select Date"
        className="cursor-pointer text-purple-600 font-bold placeholder-black text-center"
      />
      {showReset && (
        <button onClick={resetDate} className=" text-sm hover:underline">
          Reset
        </button>
      )}
    </div>
  );
};

export default DateSelector;
