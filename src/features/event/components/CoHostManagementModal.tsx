import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserType } from "@/types/UserType";
import Image from "next/image";
import { useEffect, useState } from "react";
import AddUserModal from "./AddUserModal";

interface CoHostManagementModalProps {
  handleCancel: () => void;
  handleReset: () => void;
  editMode: boolean;
  toggleEditMode: () => void;
  coHosts: any[];
  allUsers: UserType[];
  onUpdateField: (field: string, value: any) => void;
}

const CoHostManagementModal: React.FC<CoHostManagementModalProps> = ({
  coHosts,
  allUsers,
  onUpdateField,
  handleCancel,
  handleReset,
  editMode,
  toggleEditMode,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<any[]>(coHosts);
  useEffect(() => {
    setSelectedUsers(coHosts);
  }, [coHosts]);
  const handleSelectUsers = (users: UserType[]) => {
    console.log("Saving co-hosts:", selectedUsers);
    setSelectedUsers(users);
    console.log("localCoHosts", users);
  };
  const handleSaveCoHosts = () => {
    setSelectedUsers(selectedUsers);
    onUpdateField("coHosts", selectedUsers);
    toggleEditMode();
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
              selectedUsers={selectedUsers}
              onSave={handleSelectUsers}
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
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              className="text-red-600"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        ) : (
          <Button
            className="w-fit"
            variant={"outline"}
            onClick={toggleEditMode}
          >
            Edit Co-Hosts
          </Button>
        )}
      </div>

      {/* List current co-hosts */}
      <div className="mt-4 space-y-2">
        {selectedUsers.length > 0 ? (
          selectedUsers.map((coHost) => {
            const userInfo = coHost.userId;
            const userId =
              typeof userInfo === "string" ? userInfo : userInfo?._id;
            return (
              <div
                key={userId}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <div className="flex items-center">
                  {userInfo?.profileImage ? (
                    <Image
                      src={userInfo.profileImage}
                      alt={userInfo.username}
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
                    <p className="text-sm font-medium">{userInfo?.username}</p>
                    <p className="text-xs text-gray-500">{userInfo?.email}</p>
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
