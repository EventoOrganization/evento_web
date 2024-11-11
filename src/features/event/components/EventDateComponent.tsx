"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { TimeSelect } from "@/components/TimeSelect";
import { Switch } from "@/components/ui/togglerbtn";
import { useEventStore } from "@/store/useEventStore";
import { TimeSlotType } from "@/types/EventType";
import { isSameDay, setDateWithTime, updateTimeSlots } from "@/utils/dateUtils";
import { timeZonesMap } from "@/utils/timezones";
import { format, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { handleFieldChange } from "../eventActions";
import SelectTimeZone from "./SelectTimeZone";

interface EventDateComponentProps {
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  timeZone?: string;
  timeSlots?: TimeSlotType[];
  handleReset?: () => void;
  handleUpdate?: (field: string, value: any) => Promise<void>;
  handleCancel?: () => void;
  isUpdating?: boolean;
  editMode?: boolean;
  toggleEditMode?: () => void;
}

const EventDateComponent = ({
  startDate: initialStartDate,
  endDate: initialEndDate,
  startTime: initialStartTime,
  endTime: initialEndTime,
  timeZone: initialTimeZone,
  timeSlots: initialTimeSlots = [],
  handleUpdate,
  handleCancel,
  handleReset,
  isUpdating = false,
  editMode = false,
  toggleEditMode,
}: EventDateComponentProps) => {
  const today = startOfDay(new Date());
  const eventStore = useEventStore();
  const isEditMode = !!handleUpdate;
  const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const matchedTimeZone =
    timeZonesMap.find((tz) => defaultTimeZone.includes(tz.value))?.value ||
    defaultTimeZone;
  const [selectedTimeZone, setSelectedTimeZone] = useState(
    isEditMode ? initialTimeZone : eventStore.timeZone || matchedTimeZone,
  );

  const [localStartDate, setLocalStartDate] = useState<string>(
    isEditMode
      ? setDateWithTime(initialStartDate || "", initialStartTime || "00:00")
      : setDateWithTime(
          eventStore.date || format(today, "yyyy-MM-dd"),
          "00:00",
        ),
  );

  const [localEndDate, setLocalEndDate] = useState<string>(
    isEditMode
      ? setDateWithTime(initialEndDate || "", initialEndTime || "23:59")
      : setDateWithTime(
          eventStore.endDate || format(today, "yyyy-MM-dd"),
          "23:59",
        ),
  );

  const [localStartTime, setLocalStartTime] = useState<string>(
    isEditMode ? initialStartTime || "08:00" : eventStore.startTime || "08:00",
  );
  const [localEndTime, setLocalEndTime] = useState<string>(
    isEditMode ? initialEndTime || "" : eventStore.endTime || "",
  );
  const [localTimeSlots, setLocalTimeSlots] = useState<TimeSlotType[]>(
    isEditMode ? initialTimeSlots : eventStore.timeSlots || [],
  );
  const [useMultipleTimes, setUseMultipleTimes] = useState(
    initialTimeSlots.length > 1,
  );
  useEffect(() => {
    if (!eventStore.date && !isEditMode) {
      handleFieldChange("date", format(today, "yyyy-MM-dd"));
    }

    if (!eventStore.endDate && !isEditMode) {
      handleFieldChange("endDate", format(today, "yyyy-MM-dd"));
    }

    if (!eventStore.startTime && !isEditMode) {
      handleFieldChange("startTime", "08:00");
    }

    if (eventStore.endTime === undefined && !isEditMode) {
      handleFieldChange("endTime", "");
    }
  }, []);
  // Mise à jour des time slots lors du changement des dates ou du toggle
  const updateSlots = () => {
    const newTimeSlots = updateTimeSlots(
      useMultipleTimes,
      localStartDate,
      localEndDate,
      localStartTime,
      localEndTime,
    );
    setLocalTimeSlots(newTimeSlots);
  };

  useEffect(() => {
    if (!isEditMode) {
      handleFieldChange("date", localStartDate);
      handleFieldChange("endDate", localEndDate);
      handleFieldChange("startTime", localStartTime);
      handleFieldChange("endTime", localEndTime);
    }
  }, [localStartDate, localEndDate, localStartTime, localEndTime]);
  useEffect(() => {
    if (!isEditMode) eventStore.setEventField("timeSlots", localTimeSlots);
  }, [localTimeSlots]);

  useEffect(() => {
    updateSlots();
  }, [useMultipleTimes, localStartDate, localEndDate]);

  useEffect(() => {
    if (!eventStore.timeZone && !isEditMode) {
      handleFieldChange("timeZone", matchedTimeZone);
    }
  }, [matchedTimeZone]);
  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      const computedStartDate = setDateWithTime(formattedDate, localStartTime);
      setLocalStartDate(computedStartDate);
      !isEditMode && handleFieldChange("date", computedStartDate);
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      const computedEndDate = setDateWithTime(
        formattedDate,
        localEndTime,
        true,
      );
      setLocalEndDate(computedEndDate);
      !isEditMode && handleFieldChange("endDate", computedEndDate);
    }
  };

  useEffect(() => {
    if (isEditMode && initialTimeSlots) {
      setLocalTimeSlots(initialTimeSlots);
    }
  }, [isEditMode, initialTimeSlots]);

  const handleTimeChange = (field: string, value: string) => {
    const isValidTime = /^\d{2}:\d{2}$/.test(value);
    if (isValidTime) {
      if (field === "startTime") {
        setLocalStartTime(value);
        !isEditMode && handleFieldChange("startTime", value);
        if (localEndTime && value >= localEndTime) {
          setLocalEndTime("");
          !isEditMode && handleFieldChange("endTime", "");
        }
      } else if (field === "endTime") {
        setLocalEndTime(value);
        !isEditMode && handleFieldChange("endTime", value);
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
    // Vérifier si l'entrée est valide (format HH:mm)
    const isValidTime = /^\d{2}:\d{2}$/.test(value);

    if (isValidTime) {
      const updatedSlots = localTimeSlots.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot,
      );
      setLocalTimeSlots(updatedSlots);
      if (!isEditMode) {
        eventStore.setEventField("timeSlots", updatedSlots);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-2">
        <h3 className="text-eventoPurpleLight">Date</h3>
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
                    timeZone: selectedTimeZone,
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
              <Button
                onClick={() => handleReset && handleReset()}
                variant="outline"
                className="text-red-600"
              >
                Reset
              </Button>
            </div>
          ) : (
            <Button onClick={toggleEditMode} variant="outline">
              Edit Date
            </Button>
          ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" disabled={!editMode && isEditMode}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {localStartDate
                ? format(new Date(localStartDate), "dd/MM/yyyy")
                : "Select start date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={new Date(localStartDate)}
              onSelect={handleStartDateChange}
              fromDate={today}
              locale={fr}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" disabled={!editMode && isEditMode}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {localEndDate
                ? format(new Date(localEndDate), "dd/MM/yyyy")
                : "Select end date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={new Date(localEndDate)}
              onSelect={handleEndDateChange}
              fromDate={new Date(localStartDate)}
              locale={fr}
            />
          </PopoverContent>
        </Popover>
        <SelectTimeZone
          selectedTimeZone={selectedTimeZone || ""}
          setSelectedTimeZone={(value) => {
            setSelectedTimeZone(value);
            !isEditMode && handleFieldChange("timeZone", value);
          }}
          editMode={isEditMode ? editMode : true}
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
            <div
              key={index}
              className="grid grid-cols-3 gap-4 items-center mb-2"
            >
              <Input type="date" value={slot.date} readOnly disabled />
              <TimeSelect
                value={slot.startTime}
                onChange={(value) => {
                  handleTimeSlotChange(index, "startTime", value);
                  !isEditMode && handleFieldChange("timeSlots", localTimeSlots);
                }}
                disabled={!editMode && isEditMode}
              />
              <TimeSelect
                value={slot.endTime}
                onChange={(value) => {
                  handleTimeSlotChange(index, "endTime", value);
                  !isEditMode && handleFieldChange("timeSlots", localTimeSlots);
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
            disabled={!editMode && isEditMode}
          />
          <TimeSelect
            value={localEndTime}
            onChange={(value) => handleTimeChange("endTime", value)}
            filterOptions={(time) => time > localStartTime}
            disabled={!editMode && isEditMode}
          />
        </div>
      )}
    </div>
  );
};

export default EventDateComponent;