import { useEventStore } from "@/store/useEventStore";
import { UserType } from "@/types/UserType";
import { useState } from "react";
import AddUserModal from "./AddUserModal";
import GuestsAllowFriendCheckbox from "./GuestsAllowFriendCheckbox";

const EventGuestsModal = ({ allUsers }: { allUsers: UserType[] }) => {
  const eventStore = useEventStore();
  const [guests, setGuests] = useState<UserType[]>([]);

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
    <>
      <AddUserModal
        title="Add Guests"
        selectedUsers={guests}
        allUsers={allUsers}
        onSave={handleSave}
        onAddUser={addGuest}
        onRemoveUser={removeGuest}
      />
    </>
  );
};

export default EventGuestsModal;
