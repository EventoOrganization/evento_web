"use client";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useCreateEventStore } from "@/store/useCreateEventStore";
import { useInterestsStore } from "@/store/useInterestsStore";
import { InterestType } from "@/types/EventType";
import { Label } from "@radix-ui/react-label";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import MyGoogleMapComponent from "../discover/MyGoogleMapComponent";

const CreateEventForm = () => {
  const eventStore = useCreateEventStore();
  const { interests } = useInterestsStore();

  // const { isAuthenticated, user, token } = useSession();

  // formFields
  const [formTitle, setFormTitle] = useState("");
  const [formEventType, setFormEventType] = useState("public");
  const [selectedInterests, setSelectedInterests] = useState<InterestType[]>(
    [],
  );
  const [formMode, setFormMode] = useState("");
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  useEffect(() => {
    setFormTitle(eventStore.title);
    setFormEventType(eventStore.eventType);
    setSelectedInterests(eventStore.interests);
    setFormMode(eventStore.mode);
  });
  return (
    <form>
      <div>
        <Label htmlFor="title">
          Title<span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          value={formTitle}
          // onChange={handleChange}
          placeholder="Enter"
        />
      </div>
      <div className="">
        <Label htmlFor="eventType">
          Event Format<span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          className="flex items-center gap-4 mt-2"
          defaultValue={formEventType}
          // onValueChange={handleEventTypeChange}
        >
          <Label className="flex items-center gap-2">
            <RadioGroupItem value="public" id="public" />
            Public
          </Label>
          <Label className="flex items-center gap-2">
            <RadioGroupItem value="private" id="private" />
            Private
          </Label>
        </RadioGroup>
      </div>
      {eventStore.eventType === "public" && (
        <div>
          <Label htmlFor="interests">Interests Category</Label>
          <ul className="flex flex-wrap gap-2 mt-2">
            {interests.map((interest) => {
              const isSelected = selectedInterests.some(
                (i) => i._id === interest._id,
              );

              return (
                <li
                  key={interest._id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedInterests((prev) =>
                        prev.filter((i) => i._id !== interest._id),
                      );
                      eventStore.setEventField(
                        "interests",
                        selectedInterests.filter((i) => i._id !== interest._id),
                      );
                    } else {
                      const updatedInterests = [...selectedInterests, interest];
                      setSelectedInterests(updatedInterests);
                      eventStore.setEventField("interests", updatedInterests);
                    }
                  }}
                  className={`cursor-pointer px-2 py-2 rounded-md border text-sm w-fit flex items-center justify-center ${
                    isSelected
                      ? "bg-black text-white"
                      : "bg-gray-200 text-muted-foreground hover:bg-gray-300"
                  }`}
                >
                  {isSelected && <Check className="mr-2 w-4 h-4" />}
                  {interest.name}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div className="">
        <Label htmlFor="mode">
          Event Format<span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          className="flex items-center gap-4 mt-2"
          defaultValue={formMode}
          // onValueChange={handleModeChange}
        >
          <Label className="flex items-center gap-2">
            <RadioGroupItem value="virtual" id="virtual" />
            Virtual
          </Label>
          <Label className="flex items-center gap-2">
            <RadioGroupItem value="in-person" id="in-person" />
            In person
          </Label>
          <Label className="flex items-center gap-2">
            <RadioGroupItem value="both" id="both" />
            Both
          </Label>
        </RadioGroup>
      </div>
      <div className={`${formMode !== "virtual" ? "" : "hidden"}`}>
        <MyGoogleMapComponent
          location={location || { lat: 0, lng: 0 }}
          setLocation={setLocation}
        />
      </div>
    </form>
  );
};

export default CreateEventForm;
