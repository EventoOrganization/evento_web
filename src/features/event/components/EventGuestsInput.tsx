import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API } from "@/constants";
import apiService from "@/lib/apiService";
import { useEventStore } from "@/store/useEventStore";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
}

const EventGuestsInput = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const eventStore = useEventStore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiService.get<User[]>(API.allUserListing);
        console.log("Users:", response);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);
    if (eventStore.guests) {
      eventStore.setEventField("guests", [...eventStore.guests, userId]);
    }
  };

  return (
    <FormField
      name="guests"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Invite Guests</FormLabel>
          <FormControl>
            <Select onValueChange={handleUserSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {selectedUser && (
            <Button
              className="mt-2"
              onClick={() => {
                eventStore.guests &&
                  eventStore.setEventField("guests", [
                    ...eventStore.guests,
                    selectedUser,
                  ]);
                setSelectedUser(null); // Reset the selection
              }}
            >
              Add Guest
            </Button>
          )}
        </FormItem>
      )}
    />
  );
};

export default EventGuestsInput;
