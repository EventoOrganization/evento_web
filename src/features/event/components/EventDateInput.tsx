"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEventStore } from "@/store/useEventStore";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { handleFieldChange } from "../eventActions";

const EventDateInput = () => {
  const eventStore = useEventStore((state) => state);
  const { register } = useFormContext();
  const [timeSlots, setTimeSlots] = useState([
    { date: "", startTime: "", endTime: "" },
  ]);
  const [useMultipleTimes, setUseMultipleTimes] = useState(false);

  // Fonction pour générer une plage de dates entre deux dates
  const generateDateRange = (start: string, end: string) => {
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
      console.log("Generating timeSlots for multiple dates:", dateRange);
      const slots = dateRange.map((date) => ({
        date,
        startTime: eventStore.startTime,
        endTime: eventStore.endTime,
      }));
      setTimeSlots(slots);
      slots.forEach((slot, index) => {
        handleFieldChange("timeSlots", slot, index);
      });
    } else {
      const dateRange = generateDateRange(
        eventStore.date,
        eventStore.endDate || "",
      );
      console.log("Resetting to single timeSlot for date:", eventStore.date);
      const slots = dateRange.map((date) => ({
        date,
        startTime: eventStore.startTime,
        endTime: eventStore.endTime,
      }));
      setTimeSlots(slots);
      slots.forEach((slot, index) => {
        handleFieldChange("timeSlots", slot, index);
      });
    }
  };
  // console.log("Rendering timeSlots:", timeSlots);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={eventStore.date}
                  className="rounded-xl bg-muted sm:bg-background"
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange("date", e.target.value);
                    handleFieldChange(
                      "timeSlots",
                      {
                        date: e.target.value,
                      },
                      0,
                    );
                    if (
                      !eventStore.endDate ||
                      eventStore.endDate === eventStore.date
                    ) {
                      handleFieldChange("endDate", e.target.value);
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={eventStore.endDate}
                  className="rounded-xl bg-muted sm:bg-background"
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange("endDate", e.target.value);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
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
              {...register("startTime")}
              value={eventStore.startTime || ""}
              placeholder="Start Time"
              className="input"
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
              {...register("endTime")}
              value={eventStore.endTime || ""}
              placeholder="End Time"
              className="input"
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
                value={slot.date}
                {...register(`timeSlots.${index}.date`)}
                className="input"
                readOnly
              />
              <Input
                type="time"
                {...register(`timeSlots.${index}.startTime`)}
                value={slot.startTime || ""}
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
                {...register(`timeSlots.${index}.endTime`)}
                value={slot.endTime || ""}
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

export default EventDateInput;
