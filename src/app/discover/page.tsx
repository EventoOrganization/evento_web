// src/app/discover/page.tsx
"use client";
import Selector from "@/components/Selector";
import Showcase from "@/components/Showcase";
import { useDiscoverContext } from "@/contexts/DiscoverContext";

const DiscoverPage = () => {
  const { interests, events, users } = useDiscoverContext();

  return (
    <>
      <div className="grid grid-cols-2">
        <div>
          <Showcase events={events} preview={false} />
        </div>
        <div>
          <Selector options={interests} />
          <Showcase
            users={users}
            className="flex-row flex-wrap"
            itemClassName="flex w-full justify-between"
          />
        </div>
      </div>
    </>
  );
};

export default DiscoverPage;
