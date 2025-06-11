// components/EventForm.tsx

import RequiresApprovalToggle from "@/components/RequiresApprovalToggle";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SmartGooglePlacesInput from "@/features/discover/SmartGooglePlacesInput";
import CreateEventLimitedGuests from "@/features/event/components/CreateEventLimitedGuests";
import EnableChatButton from "@/features/event/components/EnableChatButton";
import EventCoHostsModal from "@/features/event/components/EventCoHostsModal";
import EventQuestionsForm from "@/features/event/components/EventQuestionsForm";
import EventURL from "@/features/event/components/EventURL";
import { useInterestsStore } from "@/store/useInterestsStore";
import { useUsersStore } from "@/store/useUsersStore";
import { EventFormValuesType, InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import CreateEventModal from "./CreateEventModal";
import EventDateComponent from "./EventDateFields";
import FormDescriptionField from "./FormDescriptionField";
import FormEventTypeField from "./FormEventTypeField";
import FormHostInput from "./FormHostInput";
import FormInterestsField from "./FormInterestsField";
import FormModeField from "./FormModeField";
import FormTitleInput from "./FormTitleInput";
import MediaFilesInput from "./MediaFilesInput";

type EventFormProps = {
  formValues: EventFormValuesType;
  onChange: (field: string, value: any) => void;
  onInputChange: (field: string, e: React.ChangeEvent<any>) => void;
  mediaFiles: File[];
  setMediaFiles: (files: File[]) => void;
  selectedInterests: InterestType[];
  setSelectedInterests: React.Dispatch<React.SetStateAction<InterestType[]>>;
  location: { lat: number; lng: number };
  setLocation: (loc: { lat: number; lng: number }) => void;
  user?: UserType | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formRef?: React.RefObject<HTMLFormElement>;
  isSubmitting?: boolean;
  setIsSubmitting?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EventForm({
  formValues,
  onChange,
  onInputChange,
  mediaFiles,
  setMediaFiles,
  selectedInterests,
  setSelectedInterests,
  location,
  setLocation,
  user,
  onSubmit,
  formRef,
  isSubmitting,
  setIsSubmitting,
}: EventFormProps) {
  const { users } = useUsersStore();
  const { interests } = useInterestsStore();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-4  w-full">
      <FormTitleInput
        title={formValues.title}
        handleFieldUpdate={onInputChange}
      />
      {(!user || (user && !user.username)) && (
        <FormHostInput
          username={formValues.username}
          handleChange={onInputChange}
        />
      )}
      <FormEventTypeField
        value={formValues.eventType}
        onChange={(val) => onChange("eventType", val)}
      />
      <FormModeField
        value={formValues.mode}
        onChange={(val) => onChange("mode", val)}
      />
      <FormDescriptionField
        value={formValues.description}
        onChange={(e) => onInputChange("description", e)}
      />
      <FormInterestsField
        interests={interests}
        selectedInterests={selectedInterests}
        onChange={(updated) => {
          setSelectedInterests(updated);
          onChange("interests", updated);
        }}
      />
      <div className={`${formValues.mode !== "virtual" ? "" : "hidden"}`}>
        <SmartGooglePlacesInput
          location={location || { lat: 0, lng: 0 }}
          setLocation={setLocation}
          onAddressChange={(address) => {
            onChange("location", address);
            console.log("Selected:", address);
          }}
          onCoordinatesChange={(coordinates) => {
            onChange("latitude", coordinates.lat);
            onChange("longitude", coordinates.lng);
          }}
        />
      </div>
      <EventDateComponent
        startDate={formValues.date}
        endDate={formValues.endDate}
        startTime={formValues.startTime}
        endTime={formValues.endTime}
        timeSlots={formValues.timeSlots}
        timeZone={formValues.timeZone}
        onChange={onChange}
      />
      <div>
        <Label htmlFor="description">
          Description<span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formValues.description}
          onChange={(e) => onInputChange("description", e)}
          placeholder="Enter event description"
        />
      </div>
      <div>
        <Label>
          Event Photos<span className="text-red-500">*</span>
        </Label>
        <MediaFilesInput value={mediaFiles} onChange={setMediaFiles} />
      </div>

      <h4>More Options</h4>
      <div className="flex flex-wrap gap-2 flex-col">
        <EventCoHostsModal
          allUsers={users as UserType[]}
          currentUserId={user?._id || ""}
          onChange={(e) => onChange("coHosts", e)}
        />
        <EnableChatButton />
        <EventURL />
        <CreateEventLimitedGuests />
        <RequiresApprovalToggle />
      </div>
      <EventQuestionsForm />
      <Button
        type="button"
        className="bg-evento-gradient w-full text-white md:hidden"
        onClick={() => setIsEventModalOpen(true)}
      >
        Preview
      </Button>
      <Button
        disabled={isSubmitting}
        variant={"eventoPrimary"}
        className="w-full"
      >
        {isSubmitting && <Loader2 className="animate-spin w-5 h-5" />} Create
        Event
      </Button>
      <CreateEventModal
        formValues={formValues}
        mediaFiles={mediaFiles}
        user={user}
        formRef={formRef}
        selectedInterests={selectedInterests}
        setSelectedInterests={setSelectedInterests}
        handleValueChange={onChange}
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />
    </form>
  );
}
