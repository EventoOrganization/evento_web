import { DiscoverProvider } from "@/contexts/DiscoverContext";
import { EventType, InterestType } from "@/types/EventType";
import { fetchData } from "@/utils/fetchData";

const DiscoverLayout = async ({ children }: { children: React.ReactNode }) => {
  const interests: InterestType[] =
    (await fetchData("/users/getInterestsListing")) || [];
  const events: EventType[] =
    (await fetchData("/users/getAllUpcomingPublicEvents")) || [];

  const contextValue = {
    interests: interests ?? [],
    events: events ?? [],
  };

  return <DiscoverProvider value={contextValue}>{children}</DiscoverProvider>;
};

export default DiscoverLayout;
