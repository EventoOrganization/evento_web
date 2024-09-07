"use client";
import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/contexts/SessionProvider";
import CreateEventPreview from "@/features/event/components/CreateEventPreview";
import EnableChatButton from "@/features/event/components/EnableChatButton";
import EventCoHostsModal from "@/features/event/components/EventCoHostsModal";
import EventLocationInput from "@/features/event/components/EventLocationInput";
import EventQuestionsForm from "@/features/event/components/EventQuestionsForm";
import EventURL from "@/features/event/components/EventURL";
import { handleFieldChange } from "@/features/event/eventActions";
import { useEventStore } from "@/store/useEventStore";
import { InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { fetchData } from "@/utils/fetchData";
import { useEffect, useState } from "react";
const CreateEventPage = () => {
  const eventStore = useEventStore();
  const [users, setUsers] = useState<UserType[]>([]);
  const [interests, setInterests] = useState<InterestType[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<InterestType[]>(
    eventStore.interests || [],
  );
  const [timeSlots, setTimeSlots] = useState(
    eventStore.timeSlots.length > 0
      ? eventStore.timeSlots
      : [
          {
            date: "",
            startTime: eventStore.startTime || "08:00",
            endTime: eventStore.endTime || "18:00",
          },
        ],
  );
  const [useMultipleTimes, setUseMultipleTimes] = useState(false);
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
      eventStore.setEventField("timeSlots", slots);
    } else {
      const slots = [
        {
          date: eventStore.date || "",
          startTime: eventStore.startTime || "08:00",
          endTime: eventStore.endTime || "18:00",
        },
      ];
      setTimeSlots(slots);
      eventStore.setEventField("timeSlots", slots);
    }
  };
  const { user } = useSession();
  useEffect(() => {
    setFormValues({
      title: eventStore.title || "",
      eventType: eventStore.eventType || "public",
      name: eventStore.name || "",
      date: eventStore.date || "",
      endDate: eventStore.endDate || eventStore.date || "",
      startTime: eventStore.startTime || "",
      endTime: eventStore.endTime || "",
      description: eventStore.description || "",
      mode: eventStore.mode || "virtual",
      location: eventStore.location || "",
      latitude: eventStore.latitude || "",
      longitude: eventStore.longitude || "",
      timeSlots: eventStore.timeSlots || [],
      guests: eventStore.guests || [],
      coHosts: eventStore.coHosts || [],
      guestsAllowFriend: eventStore.guestsAllowFriend || false,
      questions: eventStore.questions || [],
      additionalField: eventStore.additionalField || [],
      includeChat: eventStore.includeChat || false,
      URL: eventStore.URL || "",
      images: eventStore.images || [],
      video: eventStore.video || "",
    });
  }, [eventStore]);
  const [formValues, setFormValues] = useState({
    title: eventStore.title || "",
    eventType: eventStore.eventType || "public",
    name: eventStore.name || "",
    date: eventStore.date || "",
    endDate: eventStore.endDate || eventStore.date || "",
    startTime: eventStore.startTime || "",
    endTime: eventStore.endTime || "",
    description: eventStore.description || "",
    mode: eventStore.mode || "virtual",
    location: eventStore.location || "",
    latitude: eventStore.latitude || "",
    longitude: eventStore.longitude || "",
    timeSlots: eventStore.timeSlots || [],
    guests: eventStore.guests || [],
    coHosts: eventStore.coHosts || [],
    guestsAllowFriend: eventStore.guestsAllowFriend || false,
    questions: eventStore.questions || [],
    additionalField: eventStore.additionalField || [],
    includeChat: eventStore.includeChat || false,
    URL: eventStore.URL || "",
    images: eventStore.images || [],
    video: eventStore.video || "",
    // media: eventStore.media || [],
  });
  const getInterests = async () => {
    try {
      const interestRes = await fetchData<any>("/users/getInterestsListing");
      if (!interestRes.error) {
        setInterests(interestRes.data);
        console.log("Interests:", interestRes.data);
      }
    } catch (error) {
    } finally {
    }
  };
  const getUsers = async () => {
    try {
      const usersRes = await fetchData<any>("/users/allUserListing");
      if (!usersRes.error) {
        setUsers(usersRes.data);
      }
    } catch (error) {
    } finally {
    }
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    handleFieldChange(name, e.target.value);
  };
  const handleInterestsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedInterestId = e.target.value;
    const selectedInterest = interests.find(
      (i) => i._id === selectedInterestId,
    );

    if (
      selectedInterest &&
      !selectedInterests.some((i) => i._id === selectedInterestId)
    ) {
      const updatedSelectedInterests = [...selectedInterests, selectedInterest];
      setSelectedInterests(updatedSelectedInterests);
      eventStore.setEventField("interests", updatedSelectedInterests);
    }
  };

  const handleRemoveInterest = (interestId: string) => {
    setSelectedInterests((prev) => prev.filter((i) => i._id !== interestId));
    eventStore.setEventField(
      "interests",
      selectedInterests.filter((i) => i._id !== interestId),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("store Values on Submit:", eventStore);
    console.log("Form Values on Submit:", formValues);
  };
  useEffect(() => {
    getInterests();
    getUsers();
  }, []);
  return (
    <div className=" w-full flex">
      <Section className=" max-w-5xl w-full justify-start ">
        <form onSubmit={handleSubmit} className="space-y-4  w-full">
          <div>
            <Label className="sr-only" htmlFor="title">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              value={eventStore.title}
              onChange={handleChange}
              placeholder="Enter event title"
              required
            />
          </div>
          {user && !user.name && (
            <div>
              <Label className="sr-only" htmlFor="name">
                Organizer Name
              </Label>
              <Input
                id="name"
                name="name"
                value={eventStore.name}
                onChange={handleChange}
                placeholder="Organizer name"
                required
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="">
              <Label className="sr-only" htmlFor="eventType">
                Event Type
              </Label>
              <select
                id="eventType"
                name="eventType"
                value={eventStore.eventType}
                onChange={handleChange}
                className="form-select w-full text-sm px-3 py-2 rounded-md border"
                required
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div>
              <Label className="sr-only" htmlFor="mode">
                Mode
              </Label>
              <select
                id="mode"
                name="mode"
                value={eventStore.mode}
                onChange={handleChange}
                className="form-select w-full text-sm px-3 py-2 rounded-md border"
                required
              >
                <option value="virtual">Virtual</option>
                <option value="in-person">In-person</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>
          {eventStore.eventType === "public" && (
            <div>
              <Label htmlFor="interests" className="sr-only">
                Select Interests
              </Label>
              <select
                value=""
                onChange={handleInterestsChange}
                className="form-select w-full text-sm px-3 py-2 rounded-md border"
              >
                <option value="" disabled>
                  Choose interest...
                </option>
                {interests
                  .filter(
                    (i) => !selectedInterests.some((si) => si._id === i._id),
                  )
                  .map((interest) => (
                    <option key={interest._id} value={interest._id}>
                      {interest.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
          <EventLocationInput />
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
                    startTime: "08:00", // Default start time
                    endTime: "18:00", // Default end time
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
            <Label className="sr-only" htmlFor="date">
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
                  value={eventStore.startTime || "08:00"} // Default start time
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
                  value={eventStore.endTime || "18:00"} // Default end time
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
                      eventStore.setEventField("timeSlots", newTimeSlots);
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
                      eventStore.setEventField("timeSlots", newTimeSlots); // Sync with store
                    }}
                  />
                </div>
              ))
            )}
          </div>
          <div>
            <Label className="sr-only" htmlFor="description">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              required
              value={eventStore.description}
              onChange={handleChange}
              placeholder="Enter event description"
            />
          </div>
          <h4 className="text-eventoPurpleLight">More Options</h4>
          <div className="flex flex-wrap gap-2">
            <EventCoHostsModal allUsers={users as UserType[]} />
            <EnableChatButton />
            <EventURL />
          </div>
          <EventQuestionsForm />
          <Button type="submit" className="bg-blue-500 text-white">
            Submit
          </Button>
        </form>
      </Section>
      <Section className="hidden md:block">
        <CreateEventPreview handleRemoveInterest={handleRemoveInterest} />
      </Section>
    </div>
  );
};

export default CreateEventPage;
