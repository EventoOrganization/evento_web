// src/features/event/components/EventEdit.tsx
import { Switch } from "@/components/ui/togglerbtn";
import { useSession } from "@/contexts/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { useGlobalStore } from "@/store/useGlobalStore";
import { EventType, InterestType, QuestionType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { startOfDay } from "date-fns";
import { InfoIcon } from "lucide-react";
import { useState } from "react";
import CoHostManagementModal from "./CoHostManagementModal";
import EditableInputText from "./EditableInputText";
import EditableLocation from "./EditableLocation";
import EditableMultiSelect from "./EditableMultiSelect";
import EditableQuestionsForm from "./EditableQuestionsForm";
import EditableSelect from "./EditableSelect";
import EditableTextArea from "./EditableTextArea";
import EditableURLInput from "./EditableURLInput";
import EventDateComponent from "./EventDateComponent";

const EventEdit = ({
  event,
  allUsers = [],
  onUpdateField,
}: {
  event: EventType;
  allUsers: UserType[];
  onUpdateField: (field: string, value: any) => void;
}) => {
  console.log("event", event);
  const { toast } = useToast();
  const [showTooltip, setShowTooltip] = useState(false);
  const today = startOfDay(new Date());
  const [title, setTitle] = useState(event?.title || "");
  const [type, setType] = useState<string>(event?.eventType || "");
  const [mode, setMode] = useState<string>(event?.details?.mode || "");
  const [url, setUrl] = useState(event?.details?.URLlink || "");
  const [timeZone, setTimeZone] = useState(event?.details?.timeZone || "");
  const [urlTitle, setUrlTitle] = useState(event?.details?.URLtitle || "");
  const [isRestricted, setIsRestricted] = useState(event?.restricted || false);
  const [questions, setQuestions] = useState<QuestionType[]>(
    event?.questions || [],
  );
  const [createRSVP, setCreateRSVP] = useState(
    event?.details?.createRSVP || false,
  );
  const { interests } = useGlobalStore();
  const [selectedInterests, setSelectedInterests] = useState<InterestType[]>(
    event?.interests || [],
  );
  const [location, setLocation] = useState(event?.details?.location || "");
  const [longitude, setLongitude] = useState(
    event?.details?.loc?.coordinates[0] || 0,
  );
  const [latitude, setLatitude] = useState(
    event?.details?.loc?.coordinates[1] || 0,
  );
  const [description, setDescription] = useState(
    event?.details?.description || "",
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [editMode, setEditMode] = useState({
    title: false,
    location: false,
    description: false,
    interests: false,
    url: false,
    questions: false,
    eventType: false,
    mode: false,
    date: false,
    coHosts: false,
  });
  const [startDate, setStartDate] = useState(event.details?.date || "");
  const [endDate, setEndDate] = useState(event.details?.endDate || "");
  const [startTime, setStartTime] = useState(
    event.details?.startTime || "08:00",
  );
  const [endTime, setEndTime] = useState(event.details?.endTime || "18:00");
  const [timeSlots, setTimeSlots] = useState(event.details?.timeSlots || []);
  const [coHosts, setCoHosts] = useState(event.coHosts || []);
  const { token } = useSession();

  const handleUpdate = async (field: string, value: any) => {
    console.log("field", field, "value", value);
    setIsUpdating(true);
    try {
      const body = {
        field,
        value,
      };
      const response = await fetchData(
        `/events/updateEvent/${event._id}`,
        HttpMethod.PUT,
        body,
        token,
      );

      if (response.ok) {
        console.log(`${field} updated successfully`);
        console.log(response.data);
        toast({
          description: `${field} updated successfully`,
          className: "bg-evento-gradient text-white",
          duration: 3000,
        });
        console.log("field updated successfully with", value);
        onUpdateField(field, value);
      } else {
        console.error("Error updating the event");
      }
    } catch (error) {
      console.error("Error updating the event", error);
      toast({
        description: "Error updating the event",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsUpdating(false);
      setEditMode({ ...editMode, [field]: false });
    }
  };

  const toggleEditMode = (field: keyof typeof editMode) => {
    setEditMode({ ...editMode, [field]: !editMode[field] });
  };

  const handleRSVPChange = () => {
    setCreateRSVP(!createRSVP);
  };

  const handleQuestionChange = (
    index: number,
    updatedQuestion: Partial<QuestionType>,
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      ...updatedQuestion,
    };
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now().toString(),
        question: "",
        type: "text",
        options: [],
        required: false,
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleAddOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];

    if (!updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options = [];
    }

    updatedQuestions[questionIndex].options.push("");
    setQuestions(updatedQuestions);
  };

  const handleUpdateOption = (
    questionIndex: number,
    optionIndex: number,
    newOption: string,
  ) => {
    const updatedQuestions = [...questions];

    if (!updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options = [];
    }

    updatedQuestions[questionIndex].options[optionIndex] = newOption;
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];

    if (updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options = updatedQuestions[
        questionIndex
      ].options.filter((_, i: number) => i !== optionIndex);
    }

    setQuestions(updatedQuestions);
  };

  const handleUpdateRSVP = () => {
    handleUpdate("questions", questions);
  };

  const handleCancelRSVP = () => {
    setQuestions(event?.questions || []);
    setCreateRSVP(event?.details?.createRSVP || false);
  };

  const handleCancel = (field: keyof EventType["details"] | string) => {
    switch (field) {
      case "title":
        setTitle(event?.title || "");
        break;
      case "description":
        setDescription(event?.details?.description || "");
        break;
      case "interests":
        setSelectedInterests(event?.interests || []);
        break;
      case "location":
        setLocation(event?.details?.location || "");
        setLongitude(event?.details?.loc?.coordinates?.[0] || 0);
        setLatitude(event?.details?.loc?.coordinates?.[1] || 0);
        break;
      case "url":
        setUrl(event?.details?.URLlink || "");
        setUrlTitle(event?.details?.URLtitle || "");
        break;
      case "date":
        setStartDate(event.details?.date || "");
        setEndDate(event.details?.endDate || "");
        setStartTime(event.details?.startTime || "08:00");
        setEndTime(event.details?.endTime || "18:00");
        setTimeSlots(event.details?.timeSlots || []);
        setTimeZone(event.details?.timeZone || "");
        break;
      case "coHosts":
        console.log("Canceling co-hosts");
        setCoHosts(event.coHosts || []);
        break;
      default:
        break;
    }
    setEditMode({ ...editMode, [field]: false });
  };

  const handleReset = (field: keyof EventType["details"] | string) => {
    switch (field) {
      case "title":
        setTitle("");
        break;
      case "description":
        setDescription("");
        break;
      case "interests":
        setSelectedInterests([]);
        break;
      case "location":
        setLocation("");
        setLongitude(0);
        setLatitude(0);
        break;
      case "url":
        setUrl("");
        setUrlTitle("");
        break;
      case "date":
        setStartDate(today.toString());
        setEndDate(today.toString());
        setStartTime("08:00");
        setEndTime("");
        setTimeSlots([]);
        setTimeZone("");
        break;
      case "coHosts":
        console.log("Resetting co-hosts");
        setCoHosts([]);
        break;
      default:
        break;
    }
  };

  const handleUpdateLocation = async () => {
    const locationData = {
      location,
      longitude: Number(longitude), // Ensure type safety
      latitude: Number(latitude),
    };
    await handleUpdate("locationData", locationData);
  };
  return (
    <div className="space-y-4 pb-20 w-full">
      <h2>Edit Event</h2>
      {/* Title */}
      <EditableInputText
        value={title}
        onChange={setTitle}
        field="Title"
        handleUpdate={() => handleUpdate("title", title)}
        handleCancel={() => handleCancel("title")}
        handleReset={() => handleReset("title")}
        isUpdating={isUpdating}
        editMode={editMode.title}
        toggleEditMode={() => toggleEditMode("title")}
      />
      {/* Event Type */}
      <EditableSelect
        value={type}
        onChange={setType}
        field="EventType"
        handleUpdate={() => handleUpdate("eventType", type)}
        handleCancel={() => handleCancel("eventType")}
        isUpdating={isUpdating}
        editMode={editMode.eventType}
        toggleEditMode={() => toggleEditMode("eventType")}
        options={[
          { value: "public", label: "Public" },
          { value: "private", label: "Private" },
        ]}
      />
      {type === "private" && (
        <div className="flex items-center gap-2">
          <InfoIcon
            className="w-4 text-gray-500 cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <span
              className="absolute bg-gray-800 text-white text-xs rounded py-1 px-2 -mt-10 ml-4 z-10 max-w-36
            "
            >
              When <b>Restricted</b> is enabled, users accessing the event
              through the link will need to send a request to the host to join,
              unless they are explicitly invited.
            </span>
          )}
          <p className="text-sm text-muted-foreground">Restricted</p>
          <Switch
            checked={isRestricted}
            onClick={() => {
              handleUpdate("restricted", !isRestricted);
              setIsRestricted(!isRestricted);
            }}
          />
        </div>
      )}
      {/* Mode */}
      <EditableSelect
        value={mode}
        onChange={setMode}
        field="Mode"
        handleUpdate={() => handleUpdate("mode", mode)}
        handleCancel={() => handleCancel("mode")}
        isUpdating={isUpdating}
        editMode={editMode.mode}
        toggleEditMode={() => toggleEditMode("mode")}
        options={[
          { value: "virtual", label: "Virtual" },
          { value: "in-person", label: "In-person" },
          { value: "both", label: "Both" },
        ]}
      />
      {/* Interests */}
      <EditableMultiSelect
        availableOptions={interests.map((interest) => ({
          _id: interest._id || "", // Fallback to an empty string if _id is undefined
          name: interest.name || "Unknown",
        }))}
        selectedOptions={selectedInterests.map((interest) => ({
          _id: interest._id || "", // Ensure _id is always a string
          name: interest.name || "Unknown",
        }))}
        onChange={setSelectedInterests}
        handleUpdate={() => handleUpdate("interests", selectedInterests)}
        handleCancel={() => handleCancel("interests")}
        handleReset={() => handleReset("interests")}
        isUpdating={isUpdating}
        editMode={editMode.interests}
        toggleEditMode={() => toggleEditMode("interests")}
        label="Interests"
      />
      <EditableLocation
        location={location}
        longitude={longitude}
        setLongitude={setLongitude}
        setLatitude={setLatitude}
        latitude={latitude}
        setLocation={setLocation}
        handleReset={() => handleReset("location")}
        handleUpdate={handleUpdateLocation}
        handleCancel={() => handleCancel("location")}
        isUpdating={isUpdating}
        editMode={editMode.location}
        toggleEditMode={() => toggleEditMode("location")}
      />
      {/* <EditableEventDate
        startDate={startDate}
        endDate={endDate}
        startTime={startTime}
        endTime={endTime}
        timeSlots={timeSlots}
        handleUpdate={handleUpdate}
        handleCancel={() => handleCancel("date")}
        handleReset={() => handleReset("date")}
        isUpdating={isUpdating}
        editMode={editMode.date}
        toggleEditMode={() => toggleEditMode("date")}
      /> */}
      <EventDateComponent
        startDate={startDate}
        endDate={endDate}
        startTime={startTime}
        endTime={endTime}
        timeZone={timeZone}
        timeSlots={timeSlots}
        handleUpdate={(field, value) => handleUpdate(field, value)}
        handleCancel={() => handleCancel("date")}
        handleReset={() => handleReset("date")}
        isUpdating={isUpdating}
        editMode={editMode.date}
        toggleEditMode={() => toggleEditMode("date")}
      />
      <EditableTextArea
        value={description}
        onChange={setDescription}
        field="Description"
        handleUpdate={() => handleUpdate("description", description)}
        handleCancel={() => handleCancel("description")}
        handleReset={() => handleReset("description")}
        isUpdating={isUpdating}
        editMode={editMode.description}
        toggleEditMode={() => toggleEditMode("description")}
      />
      <EditableURLInput
        urlValue={url}
        titleValue={urlTitle}
        onUrlChange={setUrl}
        onUrlTitleChange={setUrlTitle}
        handleUpdate={() => {
          handleUpdate("url", { url, urlTitle });
        }}
        handleCancel={() => handleCancel("url")}
        handleReset={() => handleReset("url")}
        isUpdating={isUpdating}
        editMode={editMode.url}
        toggleEditMode={() => toggleEditMode("url")}
      />

      {event.isHosted && (
        <CoHostManagementModal
          coHosts={coHosts}
          allUsers={allUsers}
          onUpdateField={handleUpdate}
          handleCancel={() => handleCancel("coHosts")}
          handleReset={() => handleReset("coHosts")}
          editMode={editMode.coHosts}
          toggleEditMode={() => toggleEditMode("coHosts")}
        />
      )}
      {/* RSVP Questions */}
      <EditableQuestionsForm
        questions={questions}
        createRSVP={createRSVP}
        onAddQuestion={handleAddQuestion}
        onUpdateQuestion={handleQuestionChange}
        onRemoveQuestion={handleRemoveQuestion}
        onAddOption={handleAddOption}
        onUpdateOption={handleUpdateOption}
        onRemoveOption={handleRemoveOption}
        onToggleRSVP={handleRSVPChange}
        handleUpdate={handleUpdateRSVP}
        handleCancel={handleCancelRSVP}
        handleReset={() => setQuestions([])}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default EventEdit;
