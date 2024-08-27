import Section from "@/components/layout/Section";
import Event from "@/features/event/components/Event";
import EventForm from "@/features/event/components/EventForm";
import { cookies } from "next/headers";
const CreateEventPage = () => {
  const token = cookies().get("token");
  return (
    <Section className="md:mt-24 py-4 max-w-5xl w-full">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <Event />
        <EventForm className="w-full min-w-96" />
      </div>
    </Section>
  );
};

export default CreateEventPage;
