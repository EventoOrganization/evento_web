import { UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { handleError } from "@/utils/handleError";
import { handleLog } from "@/utils/handleLog";
import { handleWarning } from "@/utils/handleWarning";
import { StateCreator } from "zustand";

export interface UserSlice {
  users: UserType[];
  loadUsers: (userId: string, token: string) => Promise<void>;
  refreshUsers: (userId: string, token: string) => Promise<void>;
  setUsers: (users: UserType[]) => void;
  updateUser: (updatedUser: Partial<UserType>) => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set, get) => ({
  users: [],

  loadUsers: async (userId, token) => {
    try {
      handleLog("🔄 Loading users...");
      const endpoint =
        userId && token
          ? `/users/followStatusForUsersYouFollow/${userId}`
          : "/users/allUserListing";

      const res = await fetchData(endpoint, HttpMethod.GET, null, token);

      if (res.ok) {
        set({ users: res.data as UserType[] });
        handleLog("✅ Users loaded successfully!");
      } else {
        handleWarning({
          message: "⚠️ Failed to load users",
          source: "loadUsers",
          originalError: res.error,
        });
      }
    } catch (error) {
      handleError(error, "loadUsers");
    }
  },

  refreshUsers: async (userId, token) => {
    try {
      handleLog("🔄 Refreshing users...");
      await get().loadUsers(userId, token);
      handleLog("✅ Users refreshed successfully!");
    } catch (error) {
      handleError(error, "refreshUsers");
    }
  },

  setUsers: (users) => {
    handleLog("📝 Setting users...");
    set({ users });
  },

  updateUser: (updatedUser) => {
    try {
      handleLog(`✏️ Updating user ${updatedUser._id}...`);
      set((state) => ({
        users: state.users.map((user) =>
          user._id === updatedUser._id ? { ...user, ...updatedUser } : user,
        ),
      }));
      handleLog("✅ User updated successfully!");
    } catch (error) {
      handleError(error, "updateUser");
    }
  },
});
