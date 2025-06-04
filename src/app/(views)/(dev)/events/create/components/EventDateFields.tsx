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
import { isSameDay, setDateWithTime, updateTimeSlots } from "@/utils/dateUtils";
import { getUTCOffset, timeZonesMap } from "@/utils/timezones";
import { format, startOfDay } from "date-fns";
import { enGB } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface EventDateComponentProps {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timeZone: string;
  timeSlots: TimeSlotType[];
  handleReset?: () => void;
  handleUpdate?: (field: string, value: any) => Promise<void>;
  handleCancel?: () => void;
  isUpdating?: boolean;
  editMode?: boolean;
  toggleEditMode?: () => void;
  onChange?: (field: string, value: any) => void;
}

const EventDateComponent = ({
  startDate,
  endDate,
  startTime,
  endTime,
  timeZone,
  timeSlots,
  handleUpdate,
  handleCancel,
  // handleReset,
  isUpdating = false,
  editMode = false,
  toggleEditMode,
  onChange,
}: EventDateComponentProps) => {
  const today = startOfDay(new Date());
  const isEditMode = !!handleUpdate;
  const defaultTimeZone = getUTCOffset();
  const matchedTimeZone =
    timeZonesMap.find((tz) => defaultTimeZone.includes(tz.offset))?.offset ||
    defaultTimeZone;
  const [selectedTimeZone, setSelectedTimeZone] = useState(
    timeZone || matchedTimeZone,
  );
  const [localStartDate, setLocalStartDate] = useState<string>(
    setDateWithTime(startDate || "", startTime || "00:00"),
  );

  const [localEndDate, setLocalEndDate] = useState<string>(
    setDateWithTime(endDate || "", endTime || "23:59"),
  );

  const [localStartTime, setLocalStartTime] = useState<string>(
    startTime || "08:00",
  );
  const [localEndTime, setLocalEndTime] = useState<string>(endTime || "");
  const [localTimeSlots, setLocalTimeSlots] = useState<TimeSlotType[]>(
    timeSlots || [],
  );
  const [useMultipleTimes, setUseMultipleTimes] = useState(
    timeSlots && timeSlots.length > 1 ? true : false,
  );

  const isValidDateString = (s: string) => !!s && !isNaN(new Date(s).getTime());

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
    updateSlots();
  }, [useMultipleTimes, localStartDate, localEndDate]);

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      const computedStartDate = setDateWithTime(formattedDate, localStartTime);

      setLocalStartDate(computedStartDate);
      !isEditMode && onChange?.("date", computedStartDate);

      // Si la nouvelle startDate dépasse la endDate, met à jour la endDate
      if (new Date(computedStartDate) > new Date(localEndDate)) {
        const computedEndDate = setDateWithTime(formattedDate, "23:59");
        setLocalEndDate(computedEndDate);
        !isEditMode && onChange?.("endDate", computedEndDate);
      }
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

      // Vérifie si la endDate est inférieure à la startDate, ajuste si nécessaire
      if (new Date(computedEndDate) < new Date(localStartDate)) {
        const computedStartDate = setDateWithTime(formattedDate, "00:00");
        setLocalStartDate(computedStartDate);
        !isEditMode && onChange?.("date", computedStartDate);
      }

      setLocalEndDate(computedEndDate);
      !isEditMode && onChange?.("endDate", computedEndDate);
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
    // Vérifier si l'entrée est valide (format HH:mm)
    const isValidTime = /^\d{2}:\d{2}$/.test(value);

    if (isValidTime) {
      const updatedSlots = localTimeSlots.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot,
      );
      setLocalTimeSlots(updatedSlots);
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
              locale={enGB}
            />
          </PopoverContent>
        </Popover>
        <SelectTimeZone
          selectedTimeZone={selectedTimeZone || ""}
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
                {format(new Date(slot.date), "dd MMM yyyy", { locale: enGB })}
              </p>
              <TimeSelect
                value={`${slot.startTime}`}
                onChange={(value) => {
                  handleTimeSlotChange(index, "startTime", value);
                  !isEditMode && onChange?.("timeSlots", localTimeSlots);
                }}
                disabled={!editMode && isEditMode}
              />
              <TimeSelect
                value={slot.endTime}
                onChange={(value) => {
                  handleTimeSlotChange(index, "endTime", value);
                  !isEditMode && onChange?.("timeSlots", localTimeSlots);
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

export default EventDateComponent;
