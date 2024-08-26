import { useEventStore } from "@/store/useEventStore";
import { useState } from "react";
import AddUserModal from "./AddUserModal";
interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  lastName?: string;
  firstName?: string;
}
const EventCoHostsModal = () => {
  const eventStore = useEventStore();
  const [coHosts, setCoHosts] = useState<User[]>([]);

  const addCoHost = (user: User) => {
    setCoHosts([...coHosts, user]);
  };

  const removeCoHost = (user: User) => {
    setCoHosts(coHosts.filter((ch) => ch._id !== user._id));
  };

  const handleSave = (selectedCoHosts: string[]) => {
    eventStore.setEventField("coHosts", selectedCoHosts);
  };

  return (
    <AddUserModal
      title="Add Co-Hosts"
      selectedUsers={coHosts}
      onSave={handleSave}
      onAddUser={addCoHost}
      onRemoveUser={removeCoHost}
    />
  );
};

export default EventCoHostsModal;
