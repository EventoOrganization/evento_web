"use client";
import {
  handleDeleteMedia,
  handleUpload,
} from "@/app/(views)/(prod)/create-event/action";
import EventoLoader from "@/components/EventoLoader";
import FileUploadButton from "@/components/FileUploadButton";
import Section from "@/components/layout/Section";
import RequiresApprovalToggle from "@/components/RequiresApprovalToggle";
import SmartImage from "@/components/SmartImage";
import AuthModal from "@/components/system/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { MediaItem, useCreateEventStore } from "@/store/useCreateEventStore";
import { useEventStore } from "@/store/useEventsStore";
import { useInterestsStore } from "@/store/useInterestsStore";
import { useUsersStore } from "@/store/useUsersStore";
import { EventType, InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import heic2any from "heic2any";
import { Check, Loader2, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SmartGooglePlacesInput from "../discover/SmartGooglePlacesInput";
import CreateEventLimitedGuests from "../event/components/CreateEventLimitedGuests";
import CreateEventModal from "../event/components/CreateEventModal";
import CreateEventPreview from "../event/components/CreateEventPreview";
import EnableChatButton from "../event/components/EnableChatButton";
import EventCoHostsModal from "../event/components/EventCoHostsModal";
import EventDateComponent from "../event/components/EventDateComponent";
import EventQuestionsForm from "../event/components/EventQuestionsForm";
import EventURL from "../event/components/EventURL";
import RestrictedToggle from "../event/components/RestrictedToggle";
import { handleFieldChange } from "../event/eventActions";

const DuplicateEventContent = () => {
  const eventStore = useCreateEventStore();
  const pathname = usePathname();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { addEvent, events } = useEventStore();
  const existingEvent = events.find((event) => pathname.includes(event._id));
  const { users } = useUsersStore();
  const { interests } = useInterestsStore();
  const [tempMediaPreviews, setTempMediaPreviews] = useState<
    { url: string; type: string }[]
  >(eventStore.tempMediaPreview || []);
  const [uploadingMediaStatus, setUploadingMediaStatus] = useState<boolean[]>(
    Array(tempMediaPreviews.length).fill(false),
  );
  const [carouselIndex, setCarouselIndex] = useState(0);
  const { isAuthenticated, token, user } = useSession();
  const [selectedInterests, setSelectedInterests] = useState<InterestType[]>(
    eventStore.interests || [],
  );
  const [isConverting, setIsConverting] = useState(false);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  useEffect(() => {
    // console.log("user", user);
    if (isAuthenticated && user?.username) {
      handleFieldChange("username", user.username);
    }
  }, [isAuthenticated, user?.username]);

  useEffect(() => {
    if (existingEvent) {
      console.log("Updating store with existingEvent:", existingEvent);

      eventStore.setEventField("title", existingEvent.title || "");
      eventStore.setEventField(
        "eventType",
        existingEvent.eventType || "public",
      );
      eventStore.setEventField(
        "startTime",
        existingEvent.details?.startTime || "",
      );
      eventStore.setEventField("endTime", existingEvent.details?.endTime || "");
      eventStore.setEventField(
        "timeZone",
        existingEvent.details?.timeZone || "",
      );
      eventStore.setEventField(
        "description",
        existingEvent.details?.description || "",
      );
      eventStore.setEventField(
        "predefinedMedia",
        existingEvent.initialMedia || [],
      );
      eventStore.setEventField(
        "mode",
        existingEvent.details?.mode || "in-person",
      );
      eventStore.setEventField(
        "location",
        existingEvent.details?.location || "",
      );
      eventStore.setEventField(
        "latitude",
        existingEvent.details?.loc?.coordinates[1] || "",
      );
      eventStore.setEventField(
        "longitude",
        existingEvent.details?.loc?.coordinates[0] || "",
      );
      eventStore.setEventField(
        "timeSlots",
        existingEvent.details?.timeSlots || [],
      );
      eventStore.setEventField("coHosts", existingEvent.coHosts || []);
      eventStore.setEventField(
        "mediaPreviews",
        existingEvent.initialMedia || [],
      );
      eventStore.setEventField(
        "createRSVP",
        existingEvent.details?.createRSVP || false,
      );
      eventStore.setEventField("questions", existingEvent.questions || []);
      eventStore.setEventField("additionalField", []);
      eventStore.setEventField(
        "includeChat",
        existingEvent.details?.includeChat || false,
      );
      eventStore.setEventField("UrlLink", existingEvent.details?.URLlink || "");
      eventStore.setEventField(
        "UrlTitle",
        existingEvent.details?.URLtitle || "",
      );
      eventStore.setEventField("uploadedMedia", {
        images: existingEvent.details?.images || [],
        videos: existingEvent.details?.video || [],
      });
      eventStore.setEventField("predefinedMedia", { images: [], videos: [] });
      eventStore.setEventField("interests", existingEvent.interests || []);
      eventStore.setEventField(
        "limitedGuests",
        existingEvent.limitedGuests || null,
      );
      eventStore.setEventField(
        "requiresApproval",
        existingEvent.requiresApproval || false,
      );
      eventStore.setEventField(
        "isRestricted",
        existingEvent.restricted || false,
      );
      console.log("Event Store Updated:", eventStore);
    }
  }, [existingEvent]);

  useEffect(() => {
    setFormValues({
      title: eventStore.title || "",
      eventType: eventStore.eventType || "public",
      username: user?.username || "",
      date: eventStore.date || "",
      endDate: eventStore.endDate || eventStore.date || "",
      startTime: eventStore.startTime || "",
      endTime: eventStore.endTime || "",
      timeZone: eventStore.timeZone || "",
      description: eventStore.description || "",
      mode: eventStore.mode || "in-person",
      limitedGuests: eventStore.limitedGuests || null,
      location:
        eventStore.mode === "virtual" ? "Virtual" : eventStore.location || "",
      latitude: eventStore.latitude || "",
      longitude: eventStore.longitude || "",
      timeSlots: eventStore.timeSlots || [],
      coHosts: eventStore.coHosts || [],
      medias: eventStore.mediaPreviews || [],
      restricted: eventStore.isRestricted || false,
      createRSVP: eventStore.createRSVP || false,
      questions: eventStore.questions || [],
      additionalField: eventStore.additionalField || [],
      includeChat: eventStore.includeChat || false,
      UrlLink: eventStore.UrlLink || "",
      UrlTitle: eventStore.UrlTitle || "",
      uploadedMedia: eventStore.uploadedMedia || { images: [], videos: [] },
      predefinedMedia: eventStore.predefinedMedia || { images: [], videos: [] },
      interests: eventStore.interests || [],
      requiresApproval: eventStore.requiresApproval || false,
    });
  }, [eventStore]);
  const [formValues, setFormValues] = useState({
    title: eventStore.title || "",
    eventType: eventStore.eventType || "public",
    username: user?.username || "",
    date: eventStore.date || "",
    endDate: eventStore.endDate || eventStore.date || "",
    startTime: eventStore.startTime || "",
    endTime: eventStore.endTime || "",
    timeZone: eventStore.timeZone || "",
    description: eventStore.description || "",
    mode: eventStore.mode || "in-person",
    limitedGuests: eventStore.limitedGuests || null,
    location: eventStore.location || "",
    latitude: eventStore.latitude || "",
    medias: eventStore.mediaPreviews || [],
    longitude: eventStore.longitude || "",
    timeSlots: eventStore.timeSlots || [],
    restricted: eventStore.isRestricted || false,
    coHosts: eventStore.coHosts || [],
    createRSVP: eventStore.createRSVP || false,
    questions: eventStore.questions || [],
    additionalField: eventStore.additionalField || [],
    includeChat: eventStore.includeChat || false,
    UrlLink: eventStore.UrlLink || "",
    UrlTitle: eventStore.UrlTitle || "",
    uploadedMedia: eventStore.uploadedMedia || { images: [], videos: [] },
    predefinedMedia: eventStore.predefinedMedia || { images: [], videos: [] },
    interests: eventStore.interests || [],
    requiresApproval: eventStore.requiresApproval || false,
  });

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    if (user?.username) {
      handleFieldChange("username", user.username);
    }
    setIsEventModalOpen(true);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEventModalOpen(!isEventModalOpen);
    handleSubmit(e);
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

  const handleEventTypeChange = (value: string) => {
    setFormValues((prev) => ({
      ...prev,
      eventType: value as "public" | "private",
    }));
    handleFieldChange("eventType", value as "public" | "private");
  };

  const handleModeChange = (value: string) => {
    setFormValues((prev) => ({
      ...prev,
      mode: value as "virtual" | "in-person" | "both",
    }));
    handleFieldChange("mode", value as "virtual" | "in-person" | "both");
  };
  // medias gestion
  const handleSelectMedia = (index: number) => {
    setCarouselIndex(index);
  };
  const selectedMedia =
    eventStore.mediaPreviews[carouselIndex] || eventStore.mediaPreviews[0];
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const heicFiles = Array.from(files).filter((file) =>
        file.name.toLowerCase().endsWith(".heic"),
      );

      if (heicFiles.length > 0) {
        toast({
          title: `Conversion HEIC en cours`,
          description: `Please note that ${heicFiles.length} file${heicFiles.length > 1 ? "s" : ""} .HEIC will be converted to ${heicFiles.length > 1 ? "s" : ""} JPEG. This may take a few minutes...`,
          variant: "evento",
          duration: Infinity,
        });
      }

      const processedFiles = await Promise.all(
        Array.from(files).map(async (file) => {
          if (file.name.toLowerCase().endsWith(".heic")) {
            try {
              setIsConverting(true);
              const convertHEICtoJPEG = async (file: File): Promise<File> => {
                const blob = await heic2any({
                  blob: file,
                  toType: "image/jpeg",
                  quality: 0.9,
                });

                return new File(
                  [blob as Blob],
                  file.name.replace(/\.heic$/, ".jpeg"),
                  {
                    type: "image/jpeg",
                  },
                );
              };
              const jpegFile = await convertHEICtoJPEG(file);
              setIsConverting(false);
              toast({
                title: "Success",
                description: `${file.name} is successfully converted.`,
                variant: "evento",
                duration: 3000,
              });

              return jpegFile;
            } catch (error) {
              console.error("Erreur conversion HEIC:", error);
              toast({
                title: "Erreur de conversion",
                description: `Impossible de convertir ${file.name}.`,
                className: "bg-red-500 text-white",
                duration: 4000,
              });
              return null; // skip it
            }
          }

          return file;
        }),
      );

      // ⚠️ Filtrer les fichiers null (erreurs ou HEIC échoué)
      const validFiles = processedFiles.filter((f): f is File => f !== null);

      const previews: MediaItem[] = validFiles.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? "video" : "image",
      }));

      setTempMediaPreviews((prev) => [...prev, ...previews]);
      handleFieldChange("tempMediaPreview", [
        ...tempMediaPreviews,
        ...previews,
      ]);
    }
  };
  const cleanupInvalidTemp = (index: number) => {
    setTempMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    useCreateEventStore.setState((state) => ({
      tempMediaPreview: state.tempMediaPreview?.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    tempMediaPreviews.forEach((media, index) => {
      if (!uploadingMediaStatus[index]) {
        // Vérifie si l'URL blob est encore accessible
        fetch(media.url)
          .then((res) => {
            if (res.ok) {
              uploadMedia(media, index);
            } else {
              console.warn("Blob invalide (HTTP non OK), supprimé:", media.url);
              cleanupInvalidTemp(index);
            }
          })
          .catch(() => {
            console.warn("Blob invalide (fetch error), supprimé:", media.url);
            cleanupInvalidTemp(index);
          });
      }
    });
  }, [tempMediaPreviews]);
  const isMediaItem = (media: {
    url: string;
    type: string;
  }): media is MediaItem => {
    return media.type === "image" || media.type === "video";
  };
  const resizeImage = async (blob: Blob, width: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const scale = width / img.width;
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("No context");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (resizedBlob) => {
            if (resizedBlob) resolve(resizedBlob);
            else reject("Failed to resize");
          },
          "image/jpeg",
          0.8,
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  };
  const uploadMedia = async (
    media: { url: string; type: string },
    index: number,
  ) => {
    try {
      setUploadingMediaStatus((prev) =>
        prev.map((status, i) => (i === index ? true : status)),
      );

      const blob = await fetch(media.url).then((r) => r.blob());

      if (media.type === "image") {
        const [thumb, medium] = await Promise.all([
          resizeImage(blob, 300),
          resizeImage(blob, 800),
        ]);

        const uploadBlob = async (b: Blob) => {
          const fd = new FormData();
          fd.append("file", b);
          const [url] = await handleUpload(fd, "events/initialMedia");
          return url;
        };

        const [thumbUrl, mediumUrl, fullUrl] = await Promise.all([
          uploadBlob(thumb),
          uploadBlob(medium),
          uploadBlob(blob),
        ]);

        useCreateEventStore.setState((state) => ({
          tempMediaPreview: state.tempMediaPreview?.filter(
            (_, i) => i !== index,
          ),
          mediaPreviews: [
            ...state.mediaPreviews,
            {
              type: "image",
              url: fullUrl,
              thumbnailUrl: thumbUrl,
              mediumUrl: mediumUrl,
            },
          ],
        }));
      } else if (media.type === "video") {
        // Pour les vidéos, pas besoin de resize, juste upload
        const formData = new FormData();
        formData.append("file", blob);
        const [videoUrl] = await handleUpload(formData, "events/initialMedia");

        useCreateEventStore.setState((state) => ({
          tempMediaPreview: state.tempMediaPreview?.filter(
            (_, i) => i !== index,
          ),
          mediaPreviews: [
            ...state.mediaPreviews,
            { type: "video", url: videoUrl },
          ],
        }));
      } else {
        console.error("Invalid media type:", media.type);
      }

      setTempMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error uploading media:", error);
      setTempMediaPreviews((prev) => prev.filter((_, i) => i !== index));
      useCreateEventStore.setState((state) => ({
        tempMediaPreview: state.tempMediaPreview?.filter((_, i) => i !== index),
      }));
      toast({
        title: "Upload failed",
        description: "One or more media files could not be uploaded.",
        className: "bg-red-500 text-white",
      });
    } finally {
      setUploadingMediaStatus((prev) =>
        prev.map((status, i) => (i === index ? false : status)),
      );
    }
  };

  const deleteMedia = async (index: number, mediaItem: MediaItem) => {
    const urlsToDelete = [];

    if (mediaItem.url?.startsWith("https://evento-media-bucket.s3.")) {
      urlsToDelete.push(mediaItem.url);
    }

    if (mediaItem.thumbnailUrl?.startsWith("https://evento-media-bucket.s3.")) {
      urlsToDelete.push(mediaItem.thumbnailUrl);
    }

    if (mediaItem.mediumUrl?.startsWith("https://evento-media-bucket.s3.")) {
      urlsToDelete.push(mediaItem.mediumUrl);
    }

    // Supprimer chaque fichier
    const deletionResults = await Promise.all(
      urlsToDelete.map(async (url) => {
        const key = new URL(url).pathname.substring(1); // remove leading slash
        return handleDeleteMedia(key);
      }),
    );

    const allDeleted = deletionResults.every((result) => result === true);

    if (allDeleted) {
      useCreateEventStore.setState((state) => ({
        mediaPreviews: state.mediaPreviews?.filter((_, i) => i !== index),
      }));
    } else {
      console.warn("Certaines images n’ont pas pu être supprimées.");
    }

    // Si c'était un fichier non uploadé encore (temp)
    if (!urlsToDelete.length) {
      useCreateEventStore.setState((state) => ({
        tempMediaPreview: state.tempMediaPreview?.filter((_, i) => i !== index),
      }));
    }
  };

  const handleRemoveInterest = (interestId: string) => {
    setSelectedInterests((prev) => prev.filter((i) => i._id !== interestId));
    eventStore.setEventField(
      "interests",
      selectedInterests.filter((i) => i._id !== interestId),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true);
    e.preventDefault();

    if (!isAuthenticated) {
      setIsAuthModalOpen(!isAuthModalOpen);
      return;
    }
    console.log("Form values before validation:", formValues);
    const missingFields: string[] = [];

    const fields = [
      { name: "Title", value: formValues.title },
      { name: "Username", value: formValues.username },
      { name: "Event Type", value: formValues.eventType },
      { name: "Mode", value: formValues.mode },
      // { name: "Location", value: formValues.location },
      // { name: "Latitude", value: formValues.latitude },
      // { name: "Longitude", value: formValues.longitude },
      { name: "Date", value: formValues.date },
      { name: "End Date", value: formValues.endDate },
      { name: "Start Time", value: formValues.startTime },
      { name: "Time Zone", value: formValues.timeZone },
      // { name: "End Time", value: formValues.endTime },
      { name: "Description", value: formValues.description },
    ];
    fields.forEach((field) => {
      if (!field.value) {
        missingFields.push(field.name);
      }
    });
    if (missingFields.length > 0) {
      // console.log(eventStore.location);
      toast({
        title: "Error",
        description: `Please fill in the following fields: ${missingFields.join(", ")}`,
        className: "bg-red-500 text-white",
        duration: 3000,
      });
      return;
    }
    if (
      !formValues.timeSlots ||
      !formValues.coHosts ||
      !formValues.createRSVP ||
      !formValues.questions ||
      !formValues.includeChat ||
      !formValues.UrlLink ||
      !formValues.UrlTitle ||
      !formValues.interests
    ) {
      console.warn("Non- fields are missing or empty:", {
        timeSlots: formValues.timeSlots,
        coHosts: formValues.coHosts,
        createRSVP: formValues.createRSVP,
        questions: formValues.questions,
        includeChat: formValues.includeChat,
        URLLink: formValues.UrlLink,
        URLTitle: formValues.UrlTitle,
        interests: formValues.interests,
      });
      // return;
    }

    const initialMedia = (eventStore.mediaPreviews || [])
      .filter(
        (media: any) =>
          typeof media === "object" &&
          "url" in media &&
          media.url.startsWith("https://evento-media-bucket.s3.") &&
          media.url.includes("/events/initialMedia"),
      )
      .map((media: any) => ({
        url: media.url,
        type: media.type,
        thumbnailUrl: media.thumbnailUrl,
        mediumUrl: media.mediumUrl,
      }));
    console.log("initialMedia", initialMedia);
    const predefinedMedia = (eventStore.mediaPreviews || [])
      .filter(
        (media: any) =>
          typeof media === "object" &&
          "url" in media &&
          media.url.startsWith("https://evento-media-bucket.s3.") &&
          !media.url.includes("/events/initialMedia"),
      )
      .map((media: MediaItem) => ({
        url: media.url,
        type: media.type,
      }));
    const formData = {
      ...formValues,
      uploadedMedia: [...initialMedia],
      predefinedMedia: [...predefinedMedia],
    };
    const response = await fetchData<EventType>(
      "/events/createEvent",
      HttpMethod.POST,
      formData,
      token,
    );
    if (response.error) {
      console.error("Error creating event:", response.error);
    } else {
      addEvent(response.data?.event as EventType);
      console.log("Event added to global store:", response.data?.event);
      // addEvent(await normalizeEvent(response.data?.event));
      // console.log(
      //   "Event created successfully and added to store ! before redirect:",
      //   response.data?.event,
      // );
      eventStore.clearEventForm();
      toast({
        title: "Event created successfully",
        className: "bg-evento-gradient-button text-white",
        duration: 3000,
      });
      if (response.data?.event._id) {
        router.push(`/events/create/${response.data?.event?._id}/success`);
      } else {
        router.push(`/profile`);
      }
    }
    setIsSubmitting(false);
  };
  if (!existingEvent) return <div>Event not found</div>;
  return (
    <>
      <h1 className="animate-slideInLeft opacity-0 text-3xl md:text-4xl lg:text-5xl flex justify-center md:justify-start md:font-bold text-black w-full h-fit mt-10 px-4">
        Duplicate Event
      </h1>
      <div className=" w-full grid grid-cols-1 md:grid-cols-2 ">
        <Section className="max-w-5xl w-full justify-start ">
          <form onSubmit={handleSubmit} className="space-y-4  w-full">
            <div>
              <Label htmlFor="title">
                Title<span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={eventStore.title}
                onChange={handleChange}
                placeholder="Enter"
              />
            </div>
            {(!user || (user && !user.username)) && (
              <div>
                <Label className="sr-only" htmlFor="username">
                  Organizer Name
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={eventStore.username}
                  onChange={handleChange}
                  className="hidden"
                  placeholder="Organizer name"
                />
              </div>
            )}
            <div className="">
              <Label htmlFor="eventType">
                Event Format<span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                className="flex items-center gap-4 mt-2"
                defaultValue={eventStore.eventType}
                value={eventStore.eventType}
                onValueChange={handleEventTypeChange}
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
            {eventStore.eventType === "public" ? (
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
                              selectedInterests.filter(
                                (i) => i._id !== interest._id,
                              ),
                            );
                          } else {
                            const updatedInterests = [
                              ...selectedInterests,
                              interest,
                            ];
                            setSelectedInterests(updatedInterests);
                            eventStore.setEventField(
                              "interests",
                              updatedInterests,
                            );
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
            ) : (
              <RestrictedToggle />
            )}
            <div className="">
              <Label htmlFor="mode">
                Event Format<span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                className="flex items-center gap-4 mt-2"
                defaultValue={eventStore.mode}
                value={eventStore.mode}
                onValueChange={handleModeChange}
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
            <div className={`${eventStore.mode !== "virtual" ? "" : "hidden"}`}>
              <SmartGooglePlacesInput
                location={location || { lat: 0, lng: 0 }}
                setLocation={setLocation}
                onAddressChange={(address) => {
                  eventStore.setEventField("location", address);
                  console.log("Selected:", address);
                }}
              />
            </div>
            <EventDateComponent />
            <div>
              <Label htmlFor="description">
                Description<span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={eventStore.description}
                onChange={handleChange}
                placeholder="Enter event description"
              />
            </div>
            <div className="">
              <Label>
                Event Photos<span className="text-red-500">*</span>
              </Label>
              {selectedMedia && (
                <div className="relative w-full h-96 border rounded-md mt-4 md:hidden">
                  {selectedMedia.type === "image" ? (
                    <SmartImage
                      src={selectedMedia.url}
                      alt="Selected Media"
                      fill
                      className="object-cover rounded"
                    />
                  ) : (
                    <video
                      src={selectedMedia.url}
                      controls
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </div>
              )}
              <div className="flex mt-2 w-full">
                <FileUploadButton onChange={handleFileSelect} />
                <ul className="flex gap-2 overflow-x-scroll max-w-full ml-2 scroll-container p-2">
                  {isConverting && <EventoLoader />}
                  {[...tempMediaPreviews, ...eventStore.mediaPreviews].map(
                    (media, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelectMedia(index)}
                        className="relative w-24 h-24 overflow-hidden aspect-square border rounded-md flex-shrink-0 ring-offset-background hover:ring-2 hover:ring-ring"
                      >
                        {/* 🖼️ Image ou 🎥 Vidéo */}
                        {media.type === "image" ? (
                          <SmartImage
                            src={media.url}
                            alt={`Media ${index}`}
                            width={96}
                            height={96}
                            className="object-cover"
                            forceImg
                          />
                        ) : (
                          <video
                            src={media.url}
                            controls
                            className="object-cover w-full h-full"
                          />
                        )}

                        {/* ⏳ Loader si en cours d'upload */}
                        {tempMediaPreviews.includes(media) ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <EventoLoader />
                          </div>
                        ) : (
                          <Trash
                            className="absolute top-2 right-2 w-10 h-10 cursor-pointer rounded bg-background p-2 border hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() =>
                              isMediaItem(media) && deleteMedia(index, media)
                            }
                          />
                        )}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>

            <h4>More Options</h4>
            <div className="flex flex-wrap gap-2 flex-col">
              <EventCoHostsModal
                allUsers={users as UserType[]}
                currentUserId={user?._id || ""}
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
              {isSubmitting && <Loader2 className="animate-spin w-5 h-5" />}
              Create Event
            </Button>
          </form>
        </Section>
        <Section className="hidden md:block">
          <h2 className="mb-4">Preview</h2>
          <CreateEventPreview handleRemoveInterest={handleRemoveInterest} />
          <Button
            variant={"outline"}
            className="mt-4 shadow w-full"
            onClick={() => {
              eventStore.clearEventForm();
              router.push("/create-event");
            }}
          >
            Reset from
          </Button>
        </Section>
      </div>
      <CreateEventModal
        event={eventStore}
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSuccess={(e) => handleCreateEvent(e)}
      />
      {isAuthModalOpen && (
        <AuthModal
          onAuthSuccess={handleAuthSuccess}
          onClose={() => setIsAuthModalOpen(!isAuthModalOpen)}
        />
      )}
    </>
  );
};

export default DuplicateEventContent;
