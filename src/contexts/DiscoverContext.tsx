// src/contexts/DiscoverContext.tsx
"use client";
import { EventType, InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { createContext, useContext } from "react";

type DiscoverContextType = {
  interests: InterestType[];
  events: EventType[];
  users: UserType[];
};

const DiscoverContext = createContext<DiscoverContextType | undefined>(
  undefined,
);

export const useDiscoverContext = () => {
  const context = useContext(DiscoverContext);
  if (!context) {
    throw new Error(
      "useDiscoverContext must be used within a DiscoverProvider",
    );
  }
  return context;
};

export const DiscoverProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: DiscoverContextType;
}) => {
  return (
    <DiscoverContext.Provider value={value}>
      {children}
    </DiscoverContext.Provider>
  );
};
