"use client";
import Section from "@/components/layout/Section";
import AuthModal from "@/components/system/auth/AuthModal";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { EventFormValuesType, InterestType } from "@/types/EventType";
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
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
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
    title: "",
    eventType: "public",
    username: user?.username || "",
    date: todayStartISO,
    endDate: todayEndISO,
    startTime: "08:00",
    endTime: "",
    timeZone: tzOffset,
    description: "",
    mode: "in-person",
    limitedGuests: null,
    location: "",
    latitude: "",
    medias: [],
    longitude: "",
    timeSlots: [],
    coHosts: [],
    restricted: false,
    createRSVP: false,
    questions: [],
    additionalField: [],
    includeChat: false,
    UrlLink: "",
    UrlTitle: "",
    uploadedMedia: { images: [], videos: [] },
    predefinedMedia: { images: [], videos: [] },
    interests: [],
    requiresApproval: false,
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

    const formData = new FormData();

    Object.entries(formValues).forEach(([key, value]) => {
      if (Array.isArray(value) || typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else if (value === null || value === undefined) {
        formData.append(key, ""); // on force "" pour les null / undefined
      } else if (typeof value === "number") {
        formData.append(key, value.toString()); // number → string
      } else if (typeof value === "boolean") {
        formData.append(key, value ? "true" : "false"); // boolean → string
      } else {
        formData.append(key, value as string); // string
      }
    });

    mediaFiles.forEach((file) => {
      formData.append("mediaFiles", file, file.name);
    });

    if (user?._id) formData.append("userId", user._id);
    console.log("Form Data before submission:", Array.from(formData.entries()));
    setIsSubmitting(false);
    return;
    try {
      // Utilise fetch sans "Content-Type" (FormData le gère)
      const response = await fetch("/api/events/create", {
        method: "POST",
        body: formData,
        // Pas de headers : le navigateur gère le boundary/multipart
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });

      if (!response.ok) {
        const error = await response.text();
        toast({
          title: "Error creating event",
          description: error,
          className: "bg-red-500 text-white",
        });
        throw new Error(error);
      }

      const data = await response.json();
      toast({
        title: "Event created successfully",
        className: "bg-evento-gradient-button text-white",
        duration: 3000,
      });

      // Redirige comme avant
      if (data?.event?._id) {
        router.push(`/events/create/${data.event._id}/success`);
      } else {
        router.push(`/profile`);
      }
      // Reset form etc.
      // setFormValues(...reset)
      // setMediaFiles([])
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur",
        description: (err as Error).message,
        className: "bg-red-500 text-white",
      });
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
        <Section className="max-w-5xl w-full justify-start ">
          <EventForm
            formValues={formValues}
            onChange={handleValueChange}
            onInputChange={handleInputChange}
            mediaFiles={mediaFiles}
            setMediaFiles={setMediaFiles}
            selectedInterests={selectedInterests}
            setSelectedInterests={setSelectedInterests}
            location={location}
            setLocation={setLocation}
            user={user}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            onSubmit={handleSubmit}
            formRef={formRef}
          />
        </Section>
        <Section className="hidden md:block md:sticky top-10 self-start">
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
            mediaFiles={mediaFiles}
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
