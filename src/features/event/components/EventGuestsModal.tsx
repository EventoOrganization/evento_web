import { useEventStore } from "@/store/useEventStore";
import { UserType } from "@/types/UserType";
import { useEffect, useState } from "react";
import AddUserModal from "./AddUserModal";

const EventGuestsModal = ({ allUsers }: { allUsers: UserType[] }) => {
  const eventStore = useEventStore();
  const [guests, setGuests] = useState<UserType[]>([]);

  useEffect(() => {
    // Initialize guests from the store
    const initialGuests = allUsers.filter((user) =>
      eventStore.guests?.includes(user._id),
    );
    setGuests(initialGuests);
  }, [allUsers, eventStore.guests]);

  const addGuest = (user: UserType) => {
    setGuests([...guests, user]);
  };

  const removeGuest = (user: UserType) => {
    setGuests(guests.filter((guest) => guest._id !== user._id));
  };

  const handleSave = (selectedGuests: string[]) => {
    eventStore.setEventField("guests", selectedGuests);
  };

  return (
    <AddUserModal
      title="Add Guests"
      selectedUsers={guests.map((user) => user._id)} // Pass only IDs
      allUsers={allUsers}
      onSave={handleSave}
      storeField="guests"
    />
  );
};

export default EventGuestsModal;
