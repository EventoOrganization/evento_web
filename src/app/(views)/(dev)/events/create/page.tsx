"use client";
import Section from "@/components/layout/Section";
import AuthModal from "@/components/system/auth/AuthModal";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import {
  EventFormValuesType,
  InterestType,
  PresetMedia,
} from "@/types/EventType";
import { handleError } from "@/utils/handleError";
import { parseApiError } from "@/utils/parseApiError";
import { getUTCOffset } from "@/utils/timezones";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import EventForm from "./components/CreateEventForm";
import CreateEventPreview from "./components/CreateEventPreview";
import {
  handleInputChangeFactory,
  handleValueChangeFactory,
} from "./utils/eventFormHandlers";
const PageEventsCreate = () => {
  // global state
  const { toast } = useToast();
  const { user, isAuthenticated, token } = useSession();
  // local state
  const formRef = useRef<HTMLFormElement>(null);
  const prevFormValues = useRef<EventFormValuesType | null>(null);
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toUploadFiles, setToUploadFiles] = useState<File[]>([]);
  const [selectedPredefinedMedia, setSelectedPredefinedMedia] = useState<
    PresetMedia[]
  >([]);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [selectedInterests, setSelectedInterests] = useState<InterestType[]>(
    [],
  );
  const tzOffset = getUTCOffset();
  const todayISODate = new Date();
  const todayStartISO = new Date(
    todayISODate.setHours(0, 0, 0, 0),
  ).toISOString();
  const todayEndISO = new Date(
    todayISODate.setHours(23, 59, 0, 0),
  ).toISOString();
  const [formValues, setFormValues] = useState<EventFormValuesType>({
    // required and default values
    username: user?.username || "",
    title: "",
    description: "",
    eventType: "public",
    mode: "in-person",
    timeZone: tzOffset,
    date: todayStartISO,
    endDate: todayEndISO,
    startTime: "08:00",
    location: "",
    latitude: "",
    longitude: "",
    restricted: false,
    // optional
    endTime: "",
    timeSlots: [],
    interests: [],
    // more options
    coHosts: [],
    includeChat: false,
    UrlLink: "",
    UrlTitle: "",
    limitedGuests: null,
    requiresApproval: false,
    createRSVP: false,
    questions: [],
    additionalField: [],

    toUploadFiles: [],
    predefinedMedia: [],
  });
  const handleInputChange = useMemo(
    () => handleInputChangeFactory(setFormValues),
    [setFormValues],
  );
  const handleValueChange = useMemo(
    () => handleValueChangeFactory(setFormValues),

    [setFormValues],
  );

  useEffect(() => {
    if (selectedPredefinedMedia) {
      setFormValues((prev) => ({
        ...prev,
        predefinedMedia: selectedPredefinedMedia,
      }));
    }
  }, [selectedPredefinedMedia]);

  useEffect(() => {
    if (prevFormValues.current) {
      const changedKeys = Object.keys(formValues).filter((key) => {
        return (
          prevFormValues.current?.[key as keyof EventFormValuesType] !==
          formValues[key as keyof EventFormValuesType]
        );
      });

      changedKeys.forEach((key) => {
        console.log(
          `[FORM CHANGE] ${key}:`,
          prevFormValues.current?.[key as keyof EventFormValuesType],
          "→",
          formValues[key as keyof EventFormValuesType],
        );
      });
    }

    prevFormValues.current = formValues;
  }, [formValues]);

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setFormValues((prev) => ({
      ...prev,
      username: user?.username || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true);
    toast({
      title: "Creating Event",
      description: "Please wait while we create your event.",
      variant: "eventoPending",
      duration: Infinity,
    });
    e.preventDefault();

    if (!isAuthenticated) {
      setIsAuthModalOpen(!isAuthModalOpen);
      setIsSubmitting(false);
      return;
    }

    const missingFields: string[] = [];
    const fields = [
      { name: "Title", value: formValues.title },
      { name: "Username", value: formValues.username },
      { name: "Event Type", value: formValues.eventType },
      { name: "Mode", value: formValues.mode },
      { name: "Date", value: formValues.date },
      { name: "End Date", value: formValues.endDate },
      { name: "Start Time", value: formValues.startTime },
      { name: "Time Zone", value: formValues.timeZone },
      { name: "Description", value: formValues.description },
    ];

    fields.forEach((field) => {
      if (!field.value) missingFields.push(field.name);
    });

    if (missingFields.length > 0) {
      toast({
        title: "Error",
        description: `Please fill in: ${missingFields.join(", ")}`,
        className: "bg-red-500 text-white",
        duration: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    const cleanQuestions = (questions: any[]) => {
      console.log("Cleaning questions:", questions);
      return questions
        .filter((q) => {
          // Remove if question text is empty
          if (!q.question?.trim()) return false;

          // If type expects options, ensure it has at least one non-empty option
          if (
            (q.type === "multiple-choice" || q.type === "checkbox") &&
            (!Array.isArray(q.options) ||
              q.options.every((opt: string) => !opt?.trim()))
          ) {
            return false;
          }

          return true;
        })
        .map((q) => {
          if (
            (q.type === "multiple-choice" || q.type === "checkbox") &&
            Array.isArray(q.options)
          ) {
            return {
              ...q,
              options: q.options.filter((opt: string) => opt?.trim()),
            };
          }
          return q;
        });
    };

    if (Array.isArray(formValues.questions)) {
      formValues.questions = cleanQuestions(formValues.questions);
      console.log("Cleaned questions:", formValues.questions);
    }

    const formData = new FormData();

    Object.entries(formValues).forEach(([key, value]) => {
      if (key === "toUploadFiles") return; // 🧼 on l'ignore ici

      if (Array.isArray(value) || typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else if (value === null || value === undefined) {
        formData.append(key, "");
      } else if (typeof value === "number") {
        formData.append(key, value.toString());
      } else if (typeof value === "boolean") {
        formData.append(key, value ? "true" : "false");
      } else {
        formData.append(key, value as string);
      }
    });

    const validFiles = toUploadFiles.filter(
      (file) => file instanceof File && file.name && file.size > 0,
    );

    console.log("📦 Logging uploaded files from toUploadFiles:");
    validFiles.forEach((file, i) => {
      console.log(`🖼️ File[${i}]`, {
        name: file.name,
        type: file.type,
        size: file.size,
        instanceofFile: file instanceof File,
      });

      formData.append("mediaFiles", file, file.name);
      console.log(
        `✅ Appended file: ${file.name} (${file.type}, ${file.size} bytes)`,
      );
    });

    if (user?._id) formData.append("userId", user._id);

    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`📦 File "${key}":`, value.name, value.type, value.size);
      } else {
        console.log(`🔑 Field "${key}":`, value);
      }
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/create`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        },
      );
      if (!response.ok) {
        const msg = await parseApiError(response, "Failed to create event");
        toast({ title: "Error", description: msg, variant: "eventoError" });
        handleError(response);
      }

      const data = await response.json();

      toast({
        title: "Event created successfully",
        variant: "eventoSuccess",
        duration: 3000,
      });

      if (data?.event?._id) {
        router.push(`/events/create/${data.event._id}/success`);
      } else {
        router.push(`/profile`);
      }
    } catch (err) {
      const msg = await parseApiError(err, "Something went wrong");
      toast({ title: "Erreur", description: msg, variant: "eventoError" });
      handleError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="animate-slideInLeft opacity-0 text-3xl md:text-4xl lg:text-5xl flex justify-center md:justify-start md:font-bold text-black w-full h-fit mt-10 px-4">
        Create Event
      </h1>
      <div className=" w-full grid grid-cols-1 md:grid-cols-2">
        <Section className=" w-full justify-start ">
          <EventForm
            formValues={formValues}
            onChange={handleValueChange}
            onInputChange={handleInputChange}
            toUploadFiles={toUploadFiles}
            setToUploadFiles={setToUploadFiles}
            selectedInterests={selectedInterests}
            setSelectedInterests={setSelectedInterests}
            selectedPredefinedMedia={selectedPredefinedMedia}
            setSelectedPredefinedMedia={setSelectedPredefinedMedia}
            location={location}
            setLocation={setLocation}
            user={user}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            onSubmit={handleSubmit}
            formRef={formRef}
          />
        </Section>
        <Section className="hidden  max-w-md md:block md:sticky top-0 py-0 self-start">
          <h2 className="mb-4">Preview</h2>
          <CreateEventPreview
            user={user}
            title={formValues.title}
            username={user?.username}
            profileImage={user?.profileImage}
            interests={selectedInterests}
            date={formValues.date}
            endDate={formValues.endDate}
            startTime={formValues.startTime}
            endTime={formValues.endTime}
            location={formValues.location}
            description={formValues.description}
            UrlTitle={formValues.UrlTitle}
            UrlLink={formValues.UrlLink}
            toUploadFiles={toUploadFiles}
            selectedPredefinedMedia={selectedPredefinedMedia}
            handleRemoveInterest={(interestId) => {
              setSelectedInterests((prev) =>
                prev.filter((i) => i._id !== interestId),
              );
              handleValueChange(
                "interests",
                selectedInterests.filter((i) => i._id !== interestId),
              );
            }}
          />
        </Section>
      </div>

      {isAuthModalOpen && (
        <AuthModal
          onAuthSuccess={handleAuthSuccess}
          onClose={() => setIsAuthModalOpen(!isAuthModalOpen)}
        />
      )}
    </>
  );
};

export default PageEventsCreate;
