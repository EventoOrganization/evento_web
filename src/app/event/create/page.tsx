import CreateEventContent from "@/features/create-event/CreateEventContent";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create Event",
  description: "Create an event on Evento",
};
const eventCreatePage = () => {
  return (
    <>
      <h1 className="animate-slideInLeft opacity-0 lg:text-5xl flex justify-center md:justify-start md:font-black text-black w-full mt-10 px-4">
        Create Event
      </h1>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 p-2 md:p-4 gap-4">
        {/* <CreateEventForm />
        <CreateEventPreview /> */}
        <CreateEventContent />
      </div>
    </>
  );
};

export default eventCreatePage;
