"use client";
import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import CreateEventModal from "@/features/event/components/CreateEventModal";
import CreateEventPreview from "@/features/event/components/CreateEventPreview";
import EnableChatButton from "@/features/event/components/EnableChatButton";
import EventCoHostsModal from "@/features/event/components/EventCoHostsModal";
import EventDate from "@/features/event/components/EventDate";
import EventLocationInput from "@/features/event/components/EventLocationInput";
import EventQuestionsForm from "@/features/event/components/EventQuestionsForm";
import EventURL from "@/features/event/components/EventURL";
import { handleFieldChange } from "@/features/event/eventActions";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { useEventStore } from "@/store/useEventStore";
import { EventType, InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CreateEventPage = () => {
  const eventStore = useEventStore();
  const [users, setUsers] = useState<UserType[]>([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [interests, setInterests] = useState<InterestType[]>([]);
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, token } = useSession();
  const [selectedInterests, setSelectedInterests] = useState<InterestType[]>(
    eventStore.interests || [],
  );

  const { user } = useAuthStore((state) => state);
  useEffect(() => {
    setFormValues({
      title: eventStore.title || "",
      eventType: eventStore.eventType || "public",
      username: eventStore.username || "",
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
      createRSVP: eventStore.createRSVP || false,
      questions: eventStore.questions || [],
      additionalField: eventStore.additionalField || [],
      includeChat: eventStore.includeChat || false,
      URL: eventStore.URL || "",
      uploadedMedia: eventStore.uploadedMedia || { images: [], videos: [] },
      predefinedMedia: eventStore.predefinedMedia || { images: [], videos: [] },
      interests: eventStore.interests || [],
    });
  }, [eventStore]);
  const [formValues, setFormValues] = useState({
    title: eventStore.title || "",
    eventType: eventStore.eventType || "public",
    username: eventStore.username || "",
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
    createRSVP: eventStore.createRSVP || false,
    questions: eventStore.questions || [],
    additionalField: eventStore.additionalField || [],
    includeChat: eventStore.includeChat || false,
    URL: eventStore.URL || "",
    uploadedMedia: eventStore.uploadedMedia || { images: [], videos: [] },
    predefinedMedia: eventStore.predefinedMedia || { images: [], videos: [] },
    interests: eventStore.interests || [],
  });
  const handleAuthSuccess = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
    setIsEventModalOpen(true);
  };
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEventModalOpen(!isEventModalOpen);
    handleSubmit(e);
  };
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
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const files = Array.from(fileInput.files);
      for (const file of files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = async () => {
          const base64data = reader.result as string;

          try {
            const response = await fetch("/api/uploadTempFile", {
              method: "POST",
              body: JSON.stringify({
                base64data,
                fileName: file.name,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              const result = await response.json();
              const fileUrl = result.filePath;
              const mediaType = file.type.startsWith("video/")
                ? "video"
                : "image";
              handleFieldChange("mediaPreviews", [
                { url: fileUrl, type: mediaType },
              ]);
            } else {
              const result = await response.json();
              console.error("Failed to upload file:", result.message);
            }
          } catch (error) {
            console.error("Error uploading file:", error);
          }
        };
      }

      fileInput.value = "";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      console.log("User is not authenticated", isAuthenticated);
      setIsAuthModalOpen(!isAuthModalOpen);
    } else {
      try {
        const localMedia = (eventStore.mediaPreviews || [])
          .filter(
            (media: any) =>
              typeof media === "object" &&
              "url" in media &&
              media.url.startsWith("/uploads"),
          )
          .map((media: any) => ({
            url: media.url,
            type: media.type,
          }));
        const awsMedia = (eventStore.mediaPreviews || [])
          .filter(
            (media: any) =>
              typeof media === "object" &&
              "url" in media &&
              !media.url.startsWith("/uploads"),
          )
          .map((media: any) => ({
            url: media.url,
            type: media.type,
          }));
        const formData = {
          ...formValues,
          uploadedMedia: [...localMedia],
          predefinedMedia: [...awsMedia],
        };
        console.log("store Values on Submit:", eventStore);
        console.log("Form Values on Submit:", formData);

        await fetchData<EventType>(
          "/events/createEvent",
          HttpMethod.POST,
          formData,
          token,
        );

        try {
          await fetch("/api/cleanupTempFiles", {
            method: "POST",
            body: JSON.stringify(localMedia),
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          console.error("Error cleaning up temp files:", error);
          toast({
            title: "Error creating event",
            description: "Please try again.",
            className: "bg-red-500 text-white",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Error creating event:", error);
        toast({
          title: "Error creating event",
          description: "Please try again.",
          className: "bg-red-500 text-white",
          duration: 3000,
        });
      } finally {
        toast({
          title: "Event created successfully",
          className: "bg-evento-gradient-button text-white",
          duration: 3000,
        });
        eventStore.clearEventForm();
        router.push("/profile");
      }
    }
  };
  useEffect(() => {
    getInterests();
    getUsers();
  }, []);
  return (
    <>
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
            {(!user || (user && !user.username)) && (
              <div>
                <Label className="sr-only" htmlFor="name">
                  Organizer Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={eventStore.username}
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
            <div className="md:hidden">
              <Input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleUpload}
              />
            </div>
            <EventLocationInput />
            <EventDate />
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
            <Button
              type="button"
              className="bg-evento-gradient w-full text-white"
              onClick={() => setIsEventModalOpen(true)}
            >
              Preview
            </Button>
          </form>
        </Section>
        <Section className="hidden md:block">
          <CreateEventPreview handleRemoveInterest={handleRemoveInterest} />
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

export default CreateEventPage;
