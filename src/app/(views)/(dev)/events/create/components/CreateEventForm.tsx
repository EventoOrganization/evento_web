// components/EventForm.tsx

import RequiresApprovalToggle from "@/components/RequiresApprovalToggle";
import { Button } from "@/components/ui/button";
import SmartGooglePlacesInput from "@/features/discover/SmartGooglePlacesInput";
import CreateEventLimitedGuests from "@/features/event/components/CreateEventLimitedGuests";
import EnableChatButton from "@/features/event/components/EnableChatButton";
import EventCoHostsModal from "@/features/event/components/EventCoHostsModal";
import EventURL from "@/features/event/components/EventURL";
import { useInterestsStore } from "@/store/useInterestsStore";
import { useUsersStore } from "@/store/useUsersStore";
import { EventFormValuesType, InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import CreateEventModal from "./CreateEventModal";
import FormDateFields from "./FormDateFields";
import FormDescriptionField from "./FormDescriptionField";
import FormHostField from "./FormHostField";
import FormInterestsField from "./FormInterestsField";
import FormMediaField from "./FormMediaField";
import FormModeField from "./FormModeField";
import FormQuestionsField from "./FormQuestionsField";
import FormTitleField from "./FormTitleField";
import FormEventTypeField from "./FormTypeField";

type EventFormProps = {
  formValues: EventFormValuesType;
  onChange: (field: string, value: any) => void;
  onInputChange: (field: string, e: React.ChangeEvent<any>) => void;
  toUploadFiles: File[];
  setToUploadFiles: (files: File[]) => void;
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
  toUploadFiles,
  setToUploadFiles,
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
      <FormTitleField
        title={formValues.title}
        handleFieldUpdate={onInputChange}
      />
      {(!user || (user && !user.username)) && (
        <FormHostField
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
      <FormDateFields
        startDate={formValues.date}
        endDate={formValues.endDate}
        startTime={formValues.startTime}
        endTime={formValues.endTime}
        timeSlots={formValues.timeSlots}
        timeZoneOffset={formValues.timeZone}
        onChange={onChange}
      />
      <div>
        <FormMediaField
          onChange={(e) => {
            setToUploadFiles(e);
            onChange("toUploadFiles", e);
          }}
        />
      </div>
      <h4>More Options</h4>
      <div className="flex flex-wrap gap-2 flex-col">
        <EventCoHostsModal
          allUsers={users as UserType[]}
          currentUserId={user?._id || ""}
          onChange={(e) => onChange("coHosts", e)}
        />
        <EnableChatButton onChange={(e) => onChange("includeChat", e)} />
        <EventURL onChange={onChange} />
        <CreateEventLimitedGuests
          onChange={(e) => onChange("limitedGuests", e)}
        />
        <RequiresApprovalToggle
          onChange={(e) => onChange("requiresApproval", e)}
        />
      </div>
      <FormQuestionsField onChange={onChange} />
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
        toUploadFiles={toUploadFiles}
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
