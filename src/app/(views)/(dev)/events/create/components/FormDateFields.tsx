"use client";
import { TimeSelect } from "@/components/TimeSelect";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/togglerbtn";
import SelectTimeZone from "@/features/event/components/SelectTimeZone";
import { TimeSlotType } from "@/types/EventType";
import { parseValidDateOrFallback } from "@/utils/date/parseValidDateOrFallback";
import { isSameDay, setDateWithTime, updateTimeSlots } from "@/utils/dateUtils";
import { getUTCOffset } from "@/utils/timezones";
import { format, startOfDay } from "date-fns";
import { enGB } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface EventDateFieldsProps {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timeZoneOffset: string;
  timeSlots: TimeSlotType[];
  handleReset?: () => void;
  handleUpdate?: (field: string, value: any) => Promise<void>;
  handleCancel?: () => void;
  isUpdating?: boolean;
  editMode?: boolean;
  toggleEditMode?: () => void;
  onChange?: (field: string, value: any) => void;
}

const FormDateFields = ({
  startDate,
  endDate,
  startTime,
  endTime,
  timeZoneOffset,
  timeSlots,
  handleUpdate,
  handleCancel,
  // handleReset,
  isUpdating = false,
  editMode = false,
  toggleEditMode,
  onChange,
}: EventDateFieldsProps) => {
  const isEditMode = !!handleUpdate;
  const [localStartDate, setLocalStartDate] = useState<string>(
    startDate || new Date().toISOString(),
  );

  const [localEndDate, setLocalEndDate] = useState<string>(
    endDate || new Date().toISOString(),
  );
  const [localStartTime, setLocalStartTime] = useState<string>(
    startTime || "08:00",
  );
  const [localEndTime, setLocalEndTime] = useState<string>(endTime || "");
  const [selectedTimeZoneOffset, setSelectedTimeZone] = useState(
    timeZoneOffset || getUTCOffset(),
  );
  const [useMultipleTimes, setUseMultipleTimes] = useState(
    timeSlots && timeSlots.length > 1 ? true : false,
  );
  const [localTimeSlots, setLocalTimeSlots] = useState<TimeSlotType[]>(
    timeSlots || [],
  );

  const isValidDateString = (isoString: string) =>
    parseValidDateOrFallback(isoString).toISOString() !== "";

  const getSelectedDateForCalendar = (isoString: string): Date =>
    startOfDay(parseValidDateOrFallback(isoString));

  const getDisplayDate = (isoString: string): string =>
    format(parseValidDateOrFallback(isoString), "dd/MM/yyyy");

  const updateSlots = () => {
    const newTimeSlots = updateTimeSlots(
      useMultipleTimes,
      localStartDate,
      localEndDate,
      localStartTime,
      localEndTime,
    );
    setLocalTimeSlots(newTimeSlots);
    !isEditMode && onChange?.("timeSlots", newTimeSlots);
  };

  useEffect(() => {
    updateSlots();
  }, [useMultipleTimes, localStartDate, localEndDate]);

  useEffect(() => {
    // Recalculate localStartDate
    const formattedStartDate = format(
      parseValidDateOrFallback(localStartDate),
      "yyyy-MM-dd",
    );
    const computedStartDate = setDateWithTime(
      formattedStartDate,
      localStartTime,
      selectedTimeZoneOffset,
    );
    setLocalStartDate(computedStartDate);

    // Recalculate localEndDate
    const formattedEndDate = format(
      parseValidDateOrFallback(localEndDate),
      "yyyy-MM-dd",
    );
    const computedEndDate = setDateWithTime(
      formattedEndDate,
      localEndTime && localEndTime !== "" ? localEndTime : "23:59",
      selectedTimeZoneOffset,
    );
    setLocalEndDate(computedEndDate);

    // Optionnel: notifier le parent (si tu veux avoir un onChange sur date auto)
    if (!isEditMode) {
      onChange?.("date", computedStartDate);
      onChange?.("endDate", computedEndDate);
    }
  }, [localStartTime, localEndTime, selectedTimeZoneOffset]);

  const handleDateChange = (type: "start" | "end", date?: Date) => {
    const fallback = new Date();
    const formattedDate = format(date ?? fallback, "yyyy-MM-dd");

    const computedDate = setDateWithTime(
      formattedDate,
      type === "start"
        ? localStartTime
        : localEndTime && localEndTime !== ""
          ? localEndTime
          : "23:59",
      selectedTimeZoneOffset,
    );

    // Mise à jour de la state
    if (type === "start") {
      setLocalStartDate(computedDate);
      !isEditMode && onChange?.("date", computedDate);

      // Si start > end → on corrige end
      if (new Date(computedDate) > new Date(localEndDate)) {
        const computedEndDate = setDateWithTime(
          formattedDate,
          "23:59",
          selectedTimeZoneOffset,
        );
        setLocalEndDate(computedEndDate);
        !isEditMode && onChange?.("endDate", computedEndDate);
      }
    } else {
      setLocalEndDate(computedDate);
      !isEditMode && onChange?.("endDate", computedDate);

      // Si end < start → on corrige start
      if (new Date(computedDate) < new Date(localStartDate)) {
        const computedStartDate = setDateWithTime(
          formattedDate,
          "00:00",
          selectedTimeZoneOffset,
        );
        setLocalStartDate(computedStartDate);
        !isEditMode && onChange?.("date", computedStartDate);
      }
    }
  };

  useEffect(() => {
    if (isEditMode && timeSlots) {
      setLocalTimeSlots(timeSlots);
    }
  }, [isEditMode, timeSlots]);

  const handleTimeChange = (field: string, value: string) => {
    const isValidTime = /^\d{2}:\d{2}$/.test(value);
    if (isValidTime) {
      if (field === "startTime") {
        setLocalStartTime(value);

        // Réinitialiser endTime si elle devient invalide
        const isSingleDay =
          format(new Date(localStartDate), "yyyy-MM-dd") ===
          format(new Date(localEndDate), "yyyy-MM-dd");

        if (isSingleDay && localEndTime && value >= localEndTime) {
          setLocalEndTime("");
          !isEditMode && onChange?.("endTime", "");
        }

        !isEditMode && onChange?.("startTime", value);
      } else if (field === "endTime") {
        setLocalEndTime(value);
        !isEditMode && onChange?.("endTime", value);
      }
    }
  };

  const handleCheckboxChange = () => {
    setUseMultipleTimes(!useMultipleTimes);
  };

  const handleTimeSlotChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const isValidTime = /^\d{2}:\d{2}$/.test(value);

    if (isValidTime) {
      const updatedSlots = localTimeSlots.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot,
      );
      setLocalTimeSlots(updatedSlots);
      !isEditMode && onChange?.("timeSlots", updatedSlots);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-2">
        <Label className="">
          Date<span className="text-destructive">*</span>
        </Label>
        {isEditMode &&
          (editMode ? (
            <div className="flex gap-2">
              <Button
                onClick={() =>
                  handleUpdate("date", {
                    startDate: new Date(localStartDate).toISOString(),
                    endDate: new Date(localEndDate).toISOString(),
                    startTime: localStartTime,
                    endTime: localEndTime,
                    timeZone: selectedTimeZoneOffset,
                    timeSlots: localTimeSlots,
                  })
                }
                disabled={isUpdating}
                className="bg-evento-gradient text-white"
              >
                {isUpdating ? "Updating..." : "Update"}
              </Button>
              <Button
                onClick={() => handleCancel && handleCancel()}
                variant="outline"
                className="text-gray-600"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={toggleEditMode} variant="outline">
              Edit Date
            </Button>
          ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={!editMode && isEditMode}
              className="justify-start p-2"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {getDisplayDate(localStartDate) || "Select start date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={getSelectedDateForCalendar(localStartDate)}
              onSelect={(date) => handleDateChange("start", date)}
              fromDate={new Date()}
              locale={enGB}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={!editMode && isEditMode}
              className="justify-start p-2"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {getDisplayDate(localEndDate) || "Select end date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={getSelectedDateForCalendar(
                localEndDate || localStartDate,
              )}
              onSelect={(date) => handleDateChange("end", date)}
              fromDate={new Date(localStartDate)}
              locale={enGB}
            />
          </PopoverContent>
        </Popover>
        <SelectTimeZone
          selectedTimeZoneOffset={selectedTimeZoneOffset || ""}
          setSelectedTimeZone={(value) => {
            setSelectedTimeZone(value);
            !isEditMode && onChange?.("timeZone", value);
          }}
          editMode={isEditMode ? editMode : true}
          className="col-span-2 lg:col-span-1"
        />
      </div>
      {!isSameDay(localStartDate, localEndDate) && (
        <div className="grid grid-cols-2 gap-4 mt-4 items-center">
          <div className="flex items-center w-full justify-center">
            <Switch
              id="useMultipleTimes"
              checked={useMultipleTimes}
              onCheckedChange={handleCheckboxChange}
              disabled={!editMode && isEditMode}
            />
            <Label className="ml-2" htmlFor="useMultipleTimes">
              Use multiple times
            </Label>
          </div>
        </div>
      )}
      {useMultipleTimes ? (
        <div className="mt-4">
          {localTimeSlots.map((slot, index) => (
            <div key={index} className="flex gap-4 items-center mb-2">
              <p className="text-sm whitespace-nowrap text-black">
                {isValidDateString(slot.date)
                  ? format(new Date(slot.date), "dd MMM yyyy", { locale: enGB })
                  : "Invalid date"}
              </p>
              <TimeSelect
                value={`${slot.startTime}`}
                onChange={(value) => {
                  handleTimeSlotChange(index, "startTime", value);
                }}
                disabled={!editMode && isEditMode}
              />
              <TimeSelect
                value={slot.endTime}
                onChange={(value) => {
                  handleTimeSlotChange(index, "endTime", value);
                }}
                filterOptions={(time) => time > slot.startTime}
                disabled={!editMode && isEditMode}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <TimeSelect
            value={localStartTime}
            onChange={(value) => handleTimeChange("startTime", value)}
            filterOptions={(time) => {
              if (
                !isValidDateString(localStartDate) ||
                !isValidDateString(localEndDate)
              )
                return true;

              const isSingleDay =
                format(new Date(localStartDate), "yyyy-MM-dd") ===
                format(new Date(localEndDate), "yyyy-MM-dd");

              return isSingleDay && localEndTime ? time < localEndTime : true;
            }}
            disabled={!editMode && isEditMode}
          />
          <TimeSelect
            value={localEndTime}
            onChange={(value) => handleTimeChange("endTime", value)}
            filterOptions={(time) => {
              if (
                !isValidDateString(localStartDate) ||
                !isValidDateString(localEndDate)
              )
                return true;

              const isSingleDay =
                format(new Date(localStartDate), "yyyy-MM-dd") ===
                format(new Date(localEndDate), "yyyy-MM-dd");

              return isSingleDay ? time > localStartTime : true;
            }}
            disabled={!editMode && isEditMode}
          />
        </div>
      )}
    </div>
  );
};

export default FormDateFields;
