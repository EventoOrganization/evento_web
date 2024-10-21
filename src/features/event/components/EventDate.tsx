import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEventStore } from "@/store/useEventStore";
import { format, startOfDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { handleFieldChange } from "../eventActions";

const EventDate = () => {
  const eventStore = useEventStore();
  const today = startOfDay(new Date());
  const [useMultipleTimes, setUseMultipleTimes] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(
    eventStore.date ? new Date(eventStore.date) : undefined,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    eventStore.endDate ? new Date(eventStore.endDate) : undefined,
  );
  const [timeSlots, setTimeSlots] = useState(
    eventStore.timeSlots.length > 0
      ? eventStore.timeSlots
      : [
          {
            date: eventStore.date || new Date().toISOString().split("T")[0],
            startTime: eventStore.startTime || "08:00",
            endTime: eventStore.endTime || "18:00",
          },
        ],
  );
  useEffect(() => {
    if (!eventStore.date && !eventStore.endDate) {
      const today = new Date();
      handleFieldChange("date", today.toISOString().split("T")[0]);
      handleFieldChange("endDate", today.toISOString().split("T")[0]);
    }
    handleFieldChange("startTime", "08:00");
    handleFieldChange("endTime", "18:00");
    handleFieldChange("timeSlots", timeSlots);
  }, [timeSlots]);

  const handleStartDateChange = (date: Date | undefined) => {
    if (date && date >= today) {
      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
      setStartDate(date);
      if (!endDate || date > endDate) {
        setEndDate(date);
        handleFieldChange("endDate", formattedDate);
      }
      if (date) {
        handleFieldChange("date", formattedDate);
        setTimeSlots((prevSlots) => [
          ...prevSlots,
          {
            date: formattedDate,
            startTime: eventStore.startTime || "08:00",
            endTime: eventStore.endTime || "18:00",
          },
        ]);
      }
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
    setEndDate(date);
    if (date) {
      handleFieldChange("endDate", formattedDate);
    }
  };
  const generateDateRange = (start: string, end: string): string[] => {
    const dates = [];
    const currentDate = new Date(start);
    const lastDate = new Date(end);

    while (currentDate <= lastDate) {
      dates.push(new Date(currentDate).toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const shouldShowCheckbox =
    useMultipleTimes ||
    (eventStore.endDate &&
      eventStore.date &&
      eventStore.endDate > eventStore.date);

  const handleCheckboxChange = () => {
    setUseMultipleTimes(!useMultipleTimes);
    if (!useMultipleTimes && eventStore.date && eventStore.endDate) {
      const dateRange = generateDateRange(eventStore.date, eventStore.endDate);
      const slots = dateRange.map((date) => ({
        date,
        startTime: eventStore.startTime || "08:00",
        endTime: eventStore.endTime || "18:00",
      }));
      setTimeSlots(slots);
      handleFieldChange("isTimeSlotsEnabled", true);
      handleFieldChange("timeSlots", slots);
    } else {
      const singleSlot = [
        {
          date: eventStore.date || "",
          startTime: eventStore.startTime || "08:00",
          endTime: eventStore.endTime || "18:00",
        },
      ];
      setTimeSlots(singleSlot);
      handleFieldChange("isTimeSlotsEnabled", false);
      handleFieldChange("timeSlots", singleSlot);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? (
                format(startDate, "dd/MM/yyyy")
              ) : (
                <>
                  {eventStore.date ? (
                    format(new Date(eventStore.date), "dd/MM/yyyy")
                  ) : (
                    <span>Select start date</span>
                  )}
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleStartDateChange}
              fromDate={today}
              initialFocus
              locale={enUS}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? (
                format(endDate, "dd/MM/yyyy")
              ) : (
                <>
                  {eventStore.endDate ? (
                    format(new Date(eventStore.endDate), "dd/MM/yyyy")
                  ) : (
                    <span>Select end date</span>
                  )}
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={handleEndDateChange}
              initialFocus
              fromDate={startDate || today}
              locale={enUS}
            />
          </PopoverContent>
        </Popover>
      </div>
      {shouldShowCheckbox && (
        <div className="flex items-center mt-2">
          <Input
            type="checkbox"
            id="useMultipleTimes"
            className="w-4 h-4 rounded border-gray-300 text-eventoPink focus:ring-eventoPink"
            onChange={handleCheckboxChange}
            checked={useMultipleTimes}
          />
          <label htmlFor="useMultipleTimes" className="ml-2">
            Add multiple time slots for each date
          </label>
        </div>
      )}
      <div className="mt-4">
        {!useMultipleTimes ? (
          <div className="grid grid-cols-2 gap-4 items-center mb-2">
            <Input
              type="time"
              value={eventStore.startTime || "08:00"}
              placeholder="Start Time"
              className="input"
              required
              onChange={(e) => {
                handleFieldChange("startTime", e.target.value);
                handleFieldChange(
                  "timeSlots",
                  {
                    startTime: e.target.value,
                  },
                  0,
                );
              }}
            />
            <Input
              type="time"
              value={eventStore.endTime || "18:00"}
              placeholder="End Time"
              className="input"
              required
              onChange={(e) => {
                handleFieldChange("endTime", e.target.value);
                handleFieldChange(
                  "timeSlots",
                  {
                    endTime: e.target.value,
                  },
                  0,
                );
              }}
            />
          </div>
        ) : (
          timeSlots.map((slot, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-4 items-center mb-2"
            >
              <Input
                type="date"
                value={slot.date || ""}
                className="input"
                readOnly
              />
              <Input
                type="time"
                value={slot.startTime || "08:00"}
                placeholder="Start Time"
                className="input"
                onChange={(e) => {
                  const newTimeSlots = [...timeSlots];
                  newTimeSlots[index].startTime = e.target.value;
                  setTimeSlots(newTimeSlots);
                  handleFieldChange(
                    "timeSlots",
                    { startTime: e.target.value },
                    index,
                  );
                }}
              />
              <Input
                type="time"
                value={slot.endTime || "18:00"}
                placeholder="End Time"
                className="input"
                onChange={(e) => {
                  const newTimeSlots = [...timeSlots];
                  newTimeSlots[index].endTime = e.target.value;
                  setTimeSlots(newTimeSlots);
                  handleFieldChange(
                    "timeSlots",
                    { endTime: e.target.value },
                    index,
                  );
                }}
              />
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default EventDate;
