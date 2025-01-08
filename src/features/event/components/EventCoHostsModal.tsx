import { Label } from "@/components/ui/label";
import { useEventStore } from "@/store/useEventStore";
import { UserType } from "@/types/UserType";
import Image from "next/image";
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
  const [coHosts, setCoHosts] = useState<
    { userId: UserType; status: string }[]
  >([]);
  const handleSave = (
    selectedCoHosts: { userId: UserType; status: string }[],
  ) => {
    setCoHosts(selectedCoHosts);
    eventStore.setEventField("coHosts", selectedCoHosts);
  };

  const filteredUsers = allUsers.filter((user) => user._id !== currentUserId);
  // console.log("filteredUsers", coHosts);
  return (
    <div className="flex gap-2 items-center">
      <Label>Add Co-Hosts</Label>
      <AddCoHostsModal
        title="Co-Hosts"
        selectedUsers={coHosts}
        allUsers={filteredUsers}
        onSave={handleSave}
      />
      {coHosts.length > 0 && (
        <ul className="flex -space-x-3 overflow-hidden">
          {coHosts.map((coHost) => (
            <li
              key={coHost.userId._id}
              className="w-10 h-10 p-0.5 bg-white rounded-full"
            >
              {coHost.userId.profileImage ? (
                <Image
                  src={coHost.userId.profileImage || ""}
                  alt={coHost.userId.username}
                  width={40}
                  height={40}
                  className="rounded-full w-full h-full"
                />
              ) : (
                <Image
                  src={"/icon-96x96.png"}
                  alt={coHost.userId.username}
                  width={40}
                  height={40}
                  className="rounded-full  w-full h-full"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventCoHostsModal;
