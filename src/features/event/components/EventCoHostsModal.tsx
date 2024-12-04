import { Label } from "@/components/ui/label";
import { useEventStore } from "@/store/useEventStore";
import { UserType } from "@/types/UserType";
import { useState } from "react";
import AddCoHostsModal from "./AddUserModal";

const EventCoHostsModal = ({
  allUsers,
  currentUserId,
}: {
  allUsers: UserType[];
  currentUserId?: string;
}) => {
  const eventStore = useEventStore();
  const [coHosts, setCoHosts] = useState<{ userId: string; status: string }[]>(
    [],
  );
  const handleSave = (
    selectedCoHosts: { userId: string; status: string }[],
  ) => {
    setCoHosts(selectedCoHosts);
    eventStore.setEventField("coHosts", selectedCoHosts);
  };

  const filteredUsers = allUsers.filter((user) => user._id !== currentUserId);

  return (
    <div className="flex gap-2 items-center">
      <Label>Add Co-Hosts</Label>
      <AddCoHostsModal
        title="Co-Hosts"
        selectedUsers={coHosts}
        allUsers={filteredUsers}
        onSave={handleSave}
      />
    </div>
  );
};

export default EventCoHostsModal;
