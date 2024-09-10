import { useEventStore } from "@/store/useEventStore";
import { UserType } from "@/types/UserType";
import { useEffect, useState } from "react";
import AddUserModal from "./AddUserModal";

const EventCoHostsModal = ({
  allUsers,
  currentUserId,
}: {
  allUsers: UserType[];
  currentUserId?: string;
}) => {
  const eventStore = useEventStore();
  const [coHosts, setCoHosts] = useState<UserType[]>([]);

  useEffect(() => {
    const initialCoHosts = allUsers
      .filter((user) => user._id !== currentUserId)
      .filter((user) => eventStore.coHosts?.includes(user._id));

    setCoHosts(initialCoHosts);
  }, [allUsers, eventStore.coHosts, currentUserId]);

  const handleSave = (selectedCoHosts: string[]) => {
    eventStore.setEventField("coHosts", selectedCoHosts);
  };
  const filteredUsers = allUsers.filter((user) => user._id !== currentUserId);
  console.log("filteredUsers", filteredUsers, currentUserId);
  return (
    <AddUserModal
      title="Add Co-Hosts"
      selectedUsers={coHosts.map((user) => user._id)}
      allUsers={filteredUsers}
      onSave={handleSave}
      storeField="coHosts"
    />
  );
};

export default EventCoHostsModal;
