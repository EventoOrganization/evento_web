import { Input } from "@/components/ui/input";
import { useEventStore } from "@/store/useEventStore";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { handleFieldChange } from "../eventActions";

const EventDate = () => {
  const eventStore = useEventStore();

  // Initialise les slots de temps à partir du store ou avec des valeurs par défaut
  const [timeSlots, setTimeSlots] = useState(
    eventStore.timeSlots.length > 0
      ? eventStore.timeSlots
      : [
          {
            date: eventStore.date || "", // Utilisation des valeurs du store si présentes
            startTime: eventStore.startTime || "08:00",
            endTime: eventStore.endTime || "18:00",
          },
        ],
  );

  const [useMultipleTimes, setUseMultipleTimes] = useState(false);

  // Utilisé pour initialiser correctement les champs lorsque la page est chargée
  useEffect(() => {
    if (!eventStore.date && !eventStore.endDate) {
      const today = new Date().toISOString().split("T")[0]; // Obtient la date d'aujourd'hui
      handleFieldChange("date", today);
      handleFieldChange("endDate", today);
    }
    handleFieldChange("startTime", "08:00");
    handleFieldChange("endTime", "18:00");
    handleFieldChange("timeSlots", timeSlots); // Synchronise les slots avec le store
  }, []);

  // Génère une plage de dates entre `start` et `end`
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

  // Gère le changement de la case à cocher pour les horaires multiples
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
      handleFieldChange("timeSlots", singleSlot);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Label className="sr-only" htmlFor="date">
          Start date
        </Label>
        <Input
          type="date"
          id="date"
          value={eventStore.date || ""}
          required
          className="rounded-xl bg-muted sm:bg-background"
          onChange={(e) => {
            handleFieldChange("date", e.target.value);
            handleFieldChange(
              "timeSlots",
              {
                date: e.target.value,
                startTime: eventStore.startTime || "08:00",
                endTime: eventStore.endTime || "18:00",
              },
              0,
            );
            if (!eventStore.endDate || eventStore.endDate === eventStore.date) {
              handleFieldChange("endDate", e.target.value);
            }
          }}
        />
        <Label className="sr-only" htmlFor="endDate">
          End date
        </Label>
        <Input
          type="date"
          id="endDate"
          value={eventStore.endDate || ""}
          className="rounded-xl bg-muted sm:bg-background"
          onChange={(e) => {
            handleFieldChange("endDate", e.target.value);
          }}
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
