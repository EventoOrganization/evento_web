"use client";
import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import MyGoogleMapComponent from "@/features/discover/MyGoogleMapComponent";
import CreateEventModal from "@/features/event/components/CreateEventModal";
import CreateEventPreview from "@/features/event/components/CreateEventPreview";
import EnableChatButton from "@/features/event/components/EnableChatButton";
import EventCoHostsModal from "@/features/event/components/EventCoHostsModal";
import EventDateComponent from "@/features/event/components/EventDateComponent";
import EventQuestionsForm from "@/features/event/components/EventQuestionsForm";
import EventURL from "@/features/event/components/EventURL";
import { handleFieldChange } from "@/features/event/eventActions";
import { useToast } from "@/hooks/use-toast";
import { useEventStore } from "@/store/useEventStore";
import { useGlobalStore } from "@/store/useGlobalStore";
import { EventType, InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const CreateEventPage = () => {
  const eventStore = useEventStore();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { addEvent, users, interests, userInfo } = useGlobalStore(
    (state) => state,
  );
  const { isAuthenticated, token, user } = useSession();
  const [selectedInterests, setSelectedInterests] = useState<InterestType[]>(
    eventStore.interests || [],
  );
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  useEffect(() => {
    handleFieldChange("username", user?.username);
  }, [isAuthenticated]);
  useEffect(() => {
    setFormValues({
      title: eventStore.title || "",
      eventType: eventStore.eventType || "public",
      username: userInfo?.username || "",
      date: eventStore.date || "",
      endDate: eventStore.endDate || eventStore.date || "",
      startTime: eventStore.startTime || "",
      endTime: eventStore.endTime || "",
      timeZone: eventStore.timeZone || "",
      description: eventStore.description || "",
      mode: eventStore.mode || "in-person",
      location:
        eventStore.mode === "virtual" ? "Virtual" : eventStore.location || "",
      latitude: eventStore.latitude || "",
      longitude: eventStore.longitude || "",
      timeSlots: eventStore.timeSlots || [],
      coHosts: eventStore.coHosts || [],
      medias: eventStore.mediaPreviews || [],
      createRSVP: eventStore.createRSVP || false,
      questions: eventStore.questions || [],
      additionalField: eventStore.additionalField || [],
      includeChat: eventStore.includeChat || false,
      UrlLink: eventStore.UrlLink || "",
      UrlTitle: eventStore.UrlTitle || "",
      uploadedMedia: eventStore.uploadedMedia || { images: [], videos: [] },
      predefinedMedia: eventStore.predefinedMedia || { images: [], videos: [] },
      interests: eventStore.interests || [],
    });
  }, [eventStore]);
  const [formValues, setFormValues] = useState({
    title: eventStore.title || "",
    eventType: eventStore.eventType || "public",
    username: userInfo?.username || "",
    date: eventStore.date || "",
    endDate: eventStore.endDate || eventStore.date || "",
    startTime: eventStore.startTime || "",
    endTime: eventStore.endTime || "",
    timeZone: eventStore.timeZone || "",
    description: eventStore.description || "",
    mode: eventStore.mode || "in-person",
    location: eventStore.location || "",
    latitude: eventStore.latitude || "",
    medias: eventStore.mediaPreviews || [],
    longitude: eventStore.longitude || "",
    timeSlots: eventStore.timeSlots || [],
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
      setIsAuthModalOpen(!isAuthModalOpen);
      return;
    }
    const missingFields: string[] = [];

    const fields = [
      { name: "Title", value: formValues.title },
      { name: "Username", value: formValues.username },
      { name: "Event Type", value: formValues.eventType },
      { name: "Mode", value: formValues.mode },
      { name: "Location", value: formValues.location },
      // { name: "Latitude", value: formValues.latitude },
      // { name: "Longitude", value: formValues.longitude },
      { name: "Date", value: formValues.date },
      { name: "End Date", value: formValues.endDate },
      { name: "Start Time", value: formValues.startTime },
      { name: "Time Zone", value: formValues.timeZone },
      // { name: "End Time", value: formValues.endTime },
      { name: "Description", value: formValues.description },
      {
        name: "Média (Pictures and/or Vidéos)",
        value: formValues.medias.length > 0,
      },
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
      }));

    const predefinedMedia = (eventStore.mediaPreviews || [])
      .filter(
        (media: any) =>
          typeof media === "object" &&
          "url" in media &&
          media.url.startsWith("https://evento-media-bucket.s3.") &&
          !media.url.includes("/events/initialMedia"),
      )
      .map((media: any) => ({
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
        router.push(`/create-event/${response.data?.event?._id}/success`);
      } else {
        router.push(`/profile`);
      }
    }
  };

  return (
    <>
      {" "}
      <div className="relative flex justify-center items-center mt-10 text-eventoPurpleLight gap-2">
        <h2 className="animate-slideInLeft font-black opacity-0">
          <span>Create </span>
          <span>Event</span>
        </h2>
      </div>
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
            <ul className="flex gap-2 flex-wrap">
              {eventStore.interests &&
                eventStore.interests.map((interest: any, index: number) => (
                  <li
                    key={index}
                    onClick={() =>
                      handleRemoveInterest && handleRemoveInterest(interest._id)
                    }
                    className="bg-eventoPurpleLight/30 w-fit px-2 py-1 rounded-lg text-sm cursor-pointer flex items-center"
                  >
                    {interest.name}
                    <XIcon className="w-4 h-4 ml-1" />
                  </li>
                ))}
            </ul>
            {/* <div className="md:hidden">
              <Input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleUpload}
              />
            </div> */}
            <div className={`${eventStore.mode !== "virtual" ? "" : "hidden"}`}>
              <MyGoogleMapComponent
                location={location || { lat: 0, lng: 0 }}
                setLocation={setLocation}
              />
            </div>
            {/* <EventDate /> */}
            <EventDateComponent />
            <div>
              <Label className="sr-only" htmlFor="description">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={eventStore.description}
                onChange={handleChange}
                placeholder="Enter event description"
              />
            </div>
            <h4 className="text-eventoPurpleLight">More Options</h4>
            <div className="flex flex-wrap gap-2">
              <EventCoHostsModal
                allUsers={users as UserType[]}
                currentUserId={user?._id || ""}
              />
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
          <Button
            variant={"outline"}
            className="mt-4 shadow w-full"
            onClick={() => eventStore.clearEventForm()}
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

export default CreateEventPage;
