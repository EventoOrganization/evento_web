const DiscoverLayout = async ({ children }: { children: React.ReactNode }) => {
  // const interests: InterestType[] =
  //   (await fetchData("/users/getInterestsListing")) || [];
  // const events: EventType[] =
  //   (await fetchData("/users/getAllUpcomingPublicEvents")) || [];

  // const contextValue = {
  //   interests: interests ?? [],
  //   events: events ?? [],
  // };

  return <div>{children}</div>;
};

export default DiscoverLayout;
