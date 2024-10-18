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
  handleUpdate: (field: string, value: any) => Promise<void>; // Function passed from EventEdit to handle update
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
  handleUpdate,
  handleCancel,
  handleReset,
  isUpdating,
  editMode,
  toggleEditMode,
}: EditableEventDateProps) => {
  const today = startOfDay(new Date());

  // Local states for the form fields
  const [localStartDate, setLocalStartDate] = useState<Date>(
    initialStartDate ? new Date(initialStartDate) : today,
  );
  const [localEndDate, setLocalEndDate] = useState<Date>(
    initialEndDate ? new Date(initialEndDate) : today,
  );
  const [localStartTime, setLocalStartTime] = useState(initialStartTime);
  const [localEndTime, setLocalEndTime] = useState(initialEndTime);
  const [localTimeSlots, setLocalTimeSlots] =
    useState<TimeSlotType[]>(initialTimeSlots);

  const [useMultipleTimes, setUseMultipleTimes] = useState(false);

  useEffect(() => {
    setUseMultipleTimes(initialTimeSlots.length > 1);
  }, [initialTimeSlots]);

  const handleCheckboxChange = () => {
    setUseMultipleTimes(!useMultipleTimes);
    updateTimeslots();
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setLocalStartDate(date); // Assurez-vous de ne définir la date que si elle est définie
      if (!localEndDate || date > localEndDate) {
        setLocalEndDate(date);
      }
      updateTimeslots();
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      setLocalEndDate(date);
      updateTimeslots();
    }
  };

  const generateDateRange = (start: Date, end: Date) => {
    const dates = [];
    const currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      dates.push(format(currentDate, "yyyy-MM-dd"));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  // Fonction de mise à jour des tranches horaires selon les nouvelles dates
  const updateTimeslots = () => {
    if (useMultipleTimes && localStartDate && localEndDate) {
      const dateRange = generateDateRange(localStartDate, localEndDate);
      const newSlots = dateRange.map((date) => ({
        date,
        startTime: "08:00", // Définir l'heure de début par défaut
        endTime: "18:00", // Définir l'heure de fin par défaut
      }));
      setLocalTimeSlots(newSlots);
    } else {
      setLocalTimeSlots([]); // Réinitialiser si non applicable
    }
  };

  useEffect(() => {
    if (localStartDate && localEndDate) {
      updateTimeslots(); // Mettre à jour chaque fois que les dates changent
    }
  }, [useMultipleTimes, localStartDate, localEndDate]);

  // Handle updating the fields when the "Update" button is clicked
  const onUpdateClick = () => {
    const updatedData = {
      startDate: localStartDate?.toISOString(),
      endDate: localEndDate?.toISOString(),
      startTime: localStartTime,
      endTime: localEndTime,
      timeSlots: localTimeSlots,
    };
    handleUpdate("date", updatedData); // Call the parent function to handle the update
    toggleEditMode(); // Exit edit mode
  };
  const isSameDay = (date1: Date, date2: Date) => {
    const d1 = date1 instanceof Date ? format(date1, "yyyy-MM-dd") : date1;
    const d2 = date2 instanceof Date ? format(date2, "yyyy-MM-dd") : date2;
    return d1 === d2;
  };
  return (
    <div>
      <div className="flex justify-between">
        <h3 className="text-eventoPurpleLight">Date</h3>
        {editMode ? (
          <div className="flex gap-2">
            <Button
              onClick={onUpdateClick}
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
              {localStartDate
                ? format(localStartDate, "dd/MM/yyyy")
                : "Select start date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={localStartDate}
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
              {localEndDate
                ? format(localEndDate, "dd/MM/yyyy")
                : "Select end date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={localEndDate}
              onSelect={handleEndDateChange}
              initialFocus
              fromDate={localStartDate || today}
              locale={fr}
            />
          </PopoverContent>
        </Popover>
      </div>

      {editMode && (
        <>
          {!isSameDay(localStartDate, localEndDate) && (
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
                  value={localStartTime || "08:00"}
                  placeholder="Start Time"
                  className="input"
                  required
                  onChange={(e) => setLocalStartTime(e.target.value)}
                />
                <Input
                  type="time"
                  value={localEndTime || "18:00"}
                  placeholder="End Time"
                  className="input"
                  required
                  onChange={(e) => setLocalEndTime(e.target.value)}
                />
              </div>
            ) : (
              localTimeSlots.map((slot, index) => (
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
                      setLocalTimeSlots((prevSlots) =>
                        prevSlots.map((s, i) =>
                          i === index ? { ...s, startTime: e.target.value } : s,
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
                      setLocalTimeSlots((prevSlots) =>
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
    </div>
  );
};

export default EditableEventDate;
