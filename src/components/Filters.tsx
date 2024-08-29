"use client";
import Showcase from "@/components/Showcase";
import { EventType, InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { useEffect, useState } from "react";
import Section from "./layout/Section";

const Filters = ({
  events,
  users,
  interests,
}: {
  events: EventType[];
  users: UserType[];
  interests: InterestType[];
}) => {
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>(events);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>(users);
  const [selectedInterests, setSelectedInterests] = useState<InterestType[]>(
    [],
  );

  const handleInterestSelect = (interest: InterestType) => {
    if (selectedInterests.some((i) => i._id === interest._id)) {
      setSelectedInterests(
        selectedInterests.filter((i) => i._id !== interest._id),
      );
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  useEffect(() => {
    if (selectedInterests.length > 0) {
      setFilteredEvents(
        events.filter((event) =>
          event.interests?.some((interest) =>
            selectedInterests.some((selected) => selected._id === interest._id),
          ),
        ),
      );
      setFilteredUsers(
        users.filter((user) =>
          user.interests?.some((interest) =>
            selectedInterests.some((selected) => selected._id === interest._id),
          ),
        ),
      );
    } else {
      setFilteredEvents(events);
      setFilteredUsers(users);
    }
  }, [selectedInterests, events, users]);

  return (
    <Section>
      <div>
        {interests.map((interest: InterestType) => (
          <button
            key={interest._id}
            onClick={() => handleInterestSelect(interest)} // Passez l'objet interest entier
          >
            {interest.name}
          </button>
        ))}
      </div>

      <Showcase events={filteredEvents} preview={false} />
      <Showcase users={filteredUsers} />
    </Section>
  );
};

export default Filters;
