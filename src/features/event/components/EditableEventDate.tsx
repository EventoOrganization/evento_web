import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimeSlotType } from "@/types/EventType";
import { format, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface EditableEventDateProps {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timeSlots: TimeSlotType[];
  onUpdateField: (field: string, value: any) => void; // Function passed from EventEdit to handle update
  handleCancel: () => void; // Function passed from EventEdit to handle cancel
  handleReset: () => void; // Function passed from EventEdit to handle reset
  isUpdating: boolean;
  editMode: boolean;
  toggleEditMode: () => void; // Function to toggle between edit modes
}

const EditableEventDate = ({
  startDate: initialStartDate,
  endDate: initialEndDate,
  startTime: initialStartTime,
  endTime: initialEndTime,
  timeSlots: initialTimeSlots,
  onUpdateField,
  handleCancel,
  handleReset,
  isUpdating,
  editMode,
  toggleEditMode,
}: EditableEventDateProps) => {
  const today = startOfDay(new Date());
  const [useMultipleTimes, setUseMultipleTimes] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialStartDate ? new Date(initialStartDate) : undefined,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialEndDate ? new Date(initialEndDate) : undefined,
  );
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [timeSlots, setTimeSlots] = useState<TimeSlotType[]>(initialTimeSlots);

  useEffect(() => {
    // If the component is initialized with multiple dates, show the checkbox
    setUseMultipleTimes(initialTimeSlots.length > 1);
  }, [initialTimeSlots]);

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date && (!endDate || date > endDate)) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
  };

  const handleCheckboxChange = () => {
    setUseMultipleTimes(!useMultipleTimes);
    if (!useMultipleTimes && startDate && endDate) {
      const dateRange = generateDateRange(startDate, endDate);
      const newSlots = dateRange.map((date) => ({
        date: date,
        startTime: startTime || "08:00",
        endTime: endTime || "18:00",
      }));
      setTimeSlots(newSlots);
      onUpdateField("timeSlots", newSlots);
    } else {
      const singleSlot = [
        {
          date: startDate?.toISOString().split("T")[0] || "",
          startTime: startTime || "08:00",
          endTime: endTime || "18:00",
        },
      ];
      setTimeSlots(singleSlot);
      onUpdateField("timeSlots", singleSlot);
    }
  };

  const generateDateRange = (start: Date, end: Date): string[] => {
    const dates = [];
    const currentDate = new Date(start);
    const lastDate = new Date(end);

    while (currentDate <= lastDate) {
      dates.push(new Date(currentDate).toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  return (
    <div>
      <div className="flex justify-between">
        <h3 className="text-eventoPurpleLight">Date</h3>
        {editMode ? (
          <div className="flex gap-2">
            <Button
              onClick={() => onUpdateField("date", startDate)}
              disabled={isUpdating}
              className="bg-evento-gradient text-white"
            >
              {isUpdating ? "Updating..." : "Update"}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="text-gray-600"
            >
              Cancel
            </Button>
            {handleReset && (
              <Button
                onClick={handleReset}
                variant="outline"
                className="text-red-600"
              >
                Reset
              </Button>
            )}
          </div>
        ) : (
          <Button onClick={toggleEditMode} variant={"outline"}>
            Edit Date
          </Button>
        )}
      </div>

      <>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Start Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                disabled={!editMode}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate
                  ? format(startDate, "dd/MM/yyyy")
                  : "Select start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateChange}
                fromDate={today}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>

          {/* End Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                disabled={!editMode}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "dd/MM/yyyy") : "Select end date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateChange}
                initialFocus
                fromDate={startDate || today}
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>
        {editMode && (
          <>
            {/* Checkbox to handle multiple time slots */}
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

            <div className="mt-4">
              {!useMultipleTimes ? (
                <div className="grid grid-cols-2 gap-4 items-center mb-2">
                  <Input
                    type="time"
                    value={startTime || "08:00"}
                    placeholder="Start Time"
                    className="input"
                    required
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                  <Input
                    type="time"
                    value={endTime || "18:00"}
                    placeholder="End Time"
                    className="input"
                    required
                    onChange={(e) => setEndTime(e.target.value)}
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
                      onChange={(e) =>
                        setTimeSlots((prevSlots) =>
                          prevSlots.map((s, i) =>
                            i === index
                              ? { ...s, startTime: e.target.value }
                              : s,
                          ),
                        )
                      }
                    />
                    <Input
                      type="time"
                      value={slot.endTime || "18:00"}
                      placeholder="End Time"
                      className="input"
                      onChange={(e) =>
                        setTimeSlots((prevSlots) =>
                          prevSlots.map((s, i) =>
                            i === index ? { ...s, endTime: e.target.value } : s,
                          ),
                        )
                      }
                    />
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </>
    </div>
  );
};

export default EditableEventDate;
