import Section from "@/components/layout/Section";
import Event from "@/features/event/components/Event";
import EventForm from "@/features/event/components/EventForm";
import { Interest, Option } from "@/types/EventType";
import fetchWithToken from "@/utils/fetchWithToken";

const CreateEventPage = async () => {
  let mappedOptions: Option[] = [];

  // Fetching users with SSR
  const allUsersResult = await fetchWithToken(
    `/users/userListWithFollowingStatus`,
  );
  const sortedUsers = allUsersResult.body.sort((a: any, b: any) => {
    if (a.status === "follow-each-other" && b.status !== "follow-each-other") {
      return -1;
    }
    if (a.status !== "follow-each-other" && b.status === "follow-each-other") {
      return 1;
    }
    return 0;
  });
  const extractedUsers = sortedUsers.map((item: any) => item.user);
  // fetching interests with SSR
  try {
    const result = await fetchWithToken(`/users/getInterestsListing`);

    const data: Interest[] = result.body;

    if (Array.isArray(data)) {
      mappedOptions = data.map((interest) => ({
        value: interest._id,
        label: interest.name,
      }));
    } else {
      console.error("Unexpected data format:", result);
    }
  } catch (error) {
    console.error("Error fetching interests:", error);
  }
  return (
    <Section className="md:mt-24 py-4 max-w-5xl w-full">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <Event />
        <EventForm
          className="w-full min-w-96"
          allUsers={extractedUsers}
          interests={mappedOptions}
        />
      </div>
    </Section>
  );
};

export default CreateEventPage;
