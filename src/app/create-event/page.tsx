import Section from "@/components/layout/Section";
import EventForm from "@/features/event/components/EventForm";
import { InterestType, OptionType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { getSessionSSR } from "@/utils/authUtilsSSR";
import { fetchData } from "@/utils/fetchData";

// Définissez le type attendu pour la réponse de `/users/userListWithFollowingStatus`
type UsersWithStatusResponse = {
  _id: string;
  firstName: string;
  lastName: string;
  status: string;
  name: string;
  email: string;
}[];

const CreateEventPage = async () => {
  let mappedOptions: OptionType[] = [];
  let users: UserType[] = [];

  // Récupération de la session
  const session = getSessionSSR();

  try {
    if (!session.token) {
      // Fetching users for visitor
      const allUsersResult = await fetchData<UserType[]>(
        `/users/allUserListing`,
      );
      users = allUsersResult || [];
    } else {
      // Fetching users for authenticated user
      const allUsersAndStatusResult = await fetchData<UsersWithStatusResponse>(
        `/users/userListWithFollowingStatus`,
      );

      if (Array.isArray(allUsersAndStatusResult)) {
        const sortedUsers = allUsersAndStatusResult.sort((a, b) => {
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
        users = sortedUsers.map((item) => ({
          _id: item._id,
          firstName: item.firstName,
          lastName: item.lastName,
          email: item.email,
          status: item.status,
          name: `${item.firstName} ${item.lastName}`,
          // Ajoutez d'autres propriétés selon votre type UserType
        }));
      } else {
        console.error("Unexpected data format:", allUsersAndStatusResult);
      }
    }

    // Fetching interests with SSR
    const result = await fetchData<InterestType[]>(
      `/users/getInterestsListing`,
    );

    const data: InterestType[] = result || [];

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
