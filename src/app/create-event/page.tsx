import Section from "@/components/layout/Section";
import Event from "@/features/event/components/Event";
import EventForm from "@/features/event/components/EventForm";
import { Interest, Option } from "@/types/EventType";
import { User } from "@/types/UserType";
import { getSessionSSR } from "@/utils/authUtilsSSR"; // Importez vos utilitaires
import { fetchData } from "@/utils/fetchData";

const CreateEventPage = async () => {
  let mappedOptions: Option[] = [];
  let users: User[] = [];

  // Récupération de la session
  const session = getSessionSSR();

  try {
    if (!session.token) {
      // Fetching users for visitor
      console.log("REQUESTING ALL USERS");
      const allUsersResult = await fetchData(`/users/allUserListing`);
      users = allUsersResult.body.allUserListing || [];
    } else {
      // Fetching users for authenticated user
      const allUsersAndStatusResult = await fetchData(
        `/users/userListWithFollowingStatus`,
      );
      const sortedUsers = allUsersAndStatusResult.body.sort(
        (a: any, b: any) => {
          if (
            a.status === "follow-each-other" &&
            b.status !== "follow-each-other"
          ) {
            return -1;
          }
          if (
            a.status !== "follow-each-other" &&
            b.status === "follow-each-other"
          ) {
            return 1;
          }
          return 0;
        },
      );
      users = sortedUsers.map((item: any) => item.user);
    }

    // Fetching interests with SSR
    const result = await fetchData(`/users/getInterestsListing`);

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
    console.error("Error fetching data:", error);
  }

  return (
    <Section className="md:mt-24 py-4 max-w-5xl w-full">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <Event />
        <EventForm
          className="w-full min-w-96"
          allUsers={users}
          interests={mappedOptions}
        />
      </div>
    </Section>
  );
};

export default CreateEventPage;
