import Section from "@/components/layout/Section";
import Event from "@/features/event/components/Event";
import EventForm from "@/features/event/components/EventForm";
import { InterestType, OptionType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { getSessionSSR } from "@/utils/authUtilsSSR"; // Importez vos utilitaires
import { fetchData } from "@/utils/fetchData";

// Définissez le type attendu pour la réponse de `/users/allUserListing`
type AllUsersResponse = {
  body: {
    allUserListing: UserType[];
  };
};

// Définissez le type attendu pour la réponse de `/users/userListWithFollowingStatus`
type UsersWithStatusResponse = {
  body: {
    user: UserType;
    status: string;
  }[];
};

// Définissez le type attendu pour la réponse de `/users/getInterestsListing`
type InterestsResponse = {
  body: InterestType[];
};

const CreateEventPage = async () => {
  let mappedOptions: OptionType[] = [];
  let users: UserType[] = [];

  // Récupération de la session
  const session = getSessionSSR();

  try {
    if (!session.token) {
      // Fetching users for visitor
      console.log("REQUESTING ALL USERS");
      const allUsersResult = await fetchData<AllUsersResponse>(
        `/users/allUserListing`,
      );
      users = allUsersResult?.body.allUserListing || [];
    } else {
      // Fetching users for authenticated user
      const allUsersAndStatusResult = await fetchData<UsersWithStatusResponse>(
        `/users/userListWithFollowingStatus`,
      );
      const sortedUsers = allUsersAndStatusResult?.body.sort((a, b) => {
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
      });
      users = sortedUsers?.map((item) => item.user) || [];
    }

    // Fetching interests with SSR
    const result = await fetchData<InterestsResponse>(
      `/users/getInterestsListing`,
    );

    const data: InterestType[] = result?.body || [];

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
