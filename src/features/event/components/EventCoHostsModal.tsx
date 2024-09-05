import { useEventStore } from "@/store/useEventStore";
import { useEffect, useState } from "react";
import AddUserModal from "./AddUserModal";

interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  lastName?: string;
  firstName?: string;
}

const EventCoHostsModal = ({ allUsers }: { allUsers: User[] }) => {
  const eventStore = useEventStore();
  const [coHosts, setCoHosts] = useState<User[]>([]);

  useEffect(() => {
    // Initialize coHosts from the store
    const initialCoHosts = allUsers.filter((user) =>
      eventStore.coHosts?.includes(user._id),
    );
    setCoHosts(initialCoHosts);
  }, [allUsers, eventStore.coHosts]);

  // const addCoHost = (user: User) => {
  //   setCoHosts([...coHosts, user]);
  // };

  // const removeCoHost = (user: User) => {
  //   setCoHosts(coHosts.filter((ch) => ch._id !== user._id));
  // };

  const handleSave = (selectedCoHosts: string[]) => {
    eventStore.setEventField("coHosts", selectedCoHosts);
  };

  return (
    <AddUserModal
      title="Add Co-Hosts"
      selectedUsers={coHosts.map((user) => user._id)}
      allUsers={allUsers}
      onSave={handleSave}
      storeField="coHosts"
    />
  );
};

export default EventCoHostsModal;
