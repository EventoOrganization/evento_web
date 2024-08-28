import Showcase from "@/features/home/Showcase";
import { fetchData } from "@/utils/fetchData";

const page = async () => {
  let events;
  try {
    const data = await fetchData(`/users/allAndVirtualEventAndNear`, "POST");
    events = data;
  } catch (error) {
    console.error("Error fetching events:", error);
  }
  return <Showcase events={events?.data} />;
};

export default page;
