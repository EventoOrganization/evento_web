import { useEventStore } from "@/store/useEventStore";
import { User } from "@/types/UserType";
import { useState } from "react";
import AddUserModal from "./AddUserModal";

const EventGuestsModal = ({ allUsers }: { allUsers: User[] }) => {
  const eventStore = useEventStore();
  const [guests, setGuests] = useState<User[]>([]);

  const addGuest = (user: User) => {
    setGuests([...guests, user]);
  };

  const removeGuest = (user: User) => {
    setGuests(guests.filter((guest) => guest._id !== user._id));
  };

  const handleSave = (selectedGuests: string[]) => {
    eventStore.setEventField("guests", selectedGuests);
  };

  return (
    <AddUserModal
      title="Add Guests"
      selectedUsers={guests}
      allUsers={allUsers}
      onSave={handleSave}
      onAddUser={addGuest}
      onRemoveUser={removeGuest}
    />
  );
};

export default EventGuestsModal;
