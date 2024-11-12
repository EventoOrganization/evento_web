import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserType } from "@/types/UserType";
import Image from "next/image";
import { useEffect, useState } from "react";
import AddUserModal from "./AddUserModal";

interface CoHostManagementModalProps {
  event: any;
  allUsers: UserType[];
  onUpdateField: (field: string, value: any) => void; // Update function passed from parent
}

const CoHostManagementModal: React.FC<CoHostManagementModalProps> = ({
  event,
  allUsers,
  onUpdateField, // Receive this function from the parent component
}) => {
  const [coHosts, setCoHosts] = useState<
    { userId: string; status: string; user?: UserType }[]
  >([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (event.coHosts) {
      const mappedCoHosts = event.coHosts.map((coHost: any) => {
        return {
          userId: coHost.user_id._id,
          status: coHost.status,
          username: coHost.user_id.username,
          profileImage: coHost.user_id.profileImage,
        };
      });
      setCoHosts(mappedCoHosts);
    }
  }, [event.coHosts, allUsers]);

  const handleOpenEditMode = () => {
    setEditMode(true);
  };

  const handleCancelEditMode = () => {
    setCoHosts(
      event.coHosts.map((coHost: any) => {
        return {
          userId: coHost.user_id._id,
          status: coHost.status,
          username: coHost.user_id.username,
          profileImage: coHost.user_id.profileImage,
        };
      }) || [],
    );
    setEditMode(false);
  };

  const handleSaveCoHosts = () => {
    onUpdateField("coHosts", coHosts); // Send updated co-hosts to the parent component
    setEditMode(false); // Exit edit mode
  };

  const handleResetCoHosts = () => {
    setCoHosts([]);
  };

  return (
    <div>
      <div
        className={cn("flex flex-col  gap-2 justify-between ", {
          "flex-row": !editMode,
        })}
      >
        <h3 className="text-eventoPurpleLight">Co-Hosts</h3>
        {editMode ? (
          <div className="space-x-2 w-full flex justify-end">
            <AddUserModal
              title="Co-Hosts"
              allUsers={allUsers}
              selectedUsers={coHosts}
              onSave={setCoHosts} // Directly update the local state with selected co-hosts
            />
            <Button
              variant="outline"
              className="text-white bg-evento-gradient"
              onClick={handleSaveCoHosts} // Trigger save action
            >
              Update
            </Button>
            <Button
              variant="outline"
              className="text-gray-600"
              onClick={handleCancelEditMode}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              className="text-red-600"
              onClick={handleResetCoHosts}
            >
              Reset
            </Button>
          </div>
        ) : (
          <Button
            className="w-fit"
            variant={"outline"}
            onClick={handleOpenEditMode}
          >
            Edit Co-Hosts
          </Button>
        )}
      </div>

      {/* List current co-hosts */}
      <div className="mt-4 space-y-2">
        {coHosts.length > 0 ? (
          coHosts.map((coHost) => {
            const user = allUsers.find((user) => user._id === coHost.userId);
            return (
              <div
                key={coHost.userId}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <div className="flex items-center">
                  {user?.profileImage ? (
                    <Image
                      src={user.profileImage}
                      alt={user.username}
                      width={10}
                      height={10}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <Avatar className="w-10 h-10 rounded-full">
                      <AvatarImage
                        className="w-10 h-10 rounded-full"
                        src="https://github.com/shadcn.png"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="ml-4">
                    <p className="text-sm font-medium">{user?.username}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">{coHost.status}</div>
              </div>
            );
          })
        ) : (
          <p>No Co-Hosts added yet.</p>
        )}
      </div>
    </div>
  );
};

export default CoHostManagementModal;
