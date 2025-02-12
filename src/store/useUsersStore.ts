import { InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { handleError } from "@/utils/handleError";
import { handleLog } from "@/utils/handleLog";
import { handleWarning } from "@/utils/handleWarning";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UsersState {
  hasMore: boolean;
  users: UserType[];
  loadUsers: (userId: string, token: string) => Promise<void>;
  setUsers: (users: UserType[], hasMore: boolean) => void;
  updateUser: (updatedUser: Partial<UserType>) => void;
  getFilteredUserGroups: (
    searchText: string,
    selectedInterests: InterestType[],
  ) => {
    filteredUsers: UserType[];
    friends: UserType[];
    usersYouMayKnow: UserType[];
    usersWithSharedInterests: UserType[];
    generalSuggestions: UserType[];
  };
}

const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = "test";
    localStorage.setItem(testKey, "testValue");
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

const localStorageCustom = {
  getItem: (name: string) => {
    if (isLocalStorageAvailable()) {
      const item = localStorage.getItem(name);
      return item ? JSON.parse(item) : null;
    }
    return null;
  },
  setItem: (name: string, value: any) => {
    if (isLocalStorageAvailable()) {
      localStorage.setItem(name, JSON.stringify(value));
    }
  },
  removeItem: (name: string) => {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(name);
    }
  },
};

export const useUsersStore = create<UsersState>()(
  persist(
    (set, get) => ({
      hasMore: false,
      users: [],

      loadUsers: async (
        userId: string,
        token: string,
        searchQuery?: string,
      ) => {
        try {
          handleLog("🔄 Loading users...");

          const searchParam = searchQuery
            ? `search=${encodeURIComponent(searchQuery)}`
            : "";
          const userParam = userId ? `userId=${userId}` : "";
          const queryParams = [userParam, searchParam]
            .filter(Boolean)
            .join("&");

          const url = `/users/getUsers?${queryParams}`;

          const res = await fetchData<{ users: UserType[]; hasMore: boolean }>(
            url,
            HttpMethod.GET,
            null,
            token,
          );

          if (res.ok && res.data) {
            set({
              users: res.data.users ?? [],
              hasMore: res.data.hasMore ?? false,
            });
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

      setUsers: (users: UserType[], hasMore: boolean) => {
        handleLog("📝 Setting users...");
        set({ users, hasMore });
      },

      updateUser: (updatedUser: Partial<UserType>) => {
        try {
          handleLog(`✏️ Updating user ${updatedUser._id}...`);
          set((state: UsersState) => ({
            users: state.users.map((user: UserType) =>
              user._id === updatedUser._id ? { ...user, ...updatedUser } : user,
            ),
          }));
          handleLog("✅ User updated successfully!");
        } catch (error) {
          handleError(error, "updateUser");
        }
      },

      getFilteredUserGroups: (
        searchText: string,
        selectedInterests: InterestType[],
      ) => {
        const filteredUsers = get().users.filter((user) => {
          if (user.username.toLowerCase() === "anonymous") {
            return false;
          }
          const matchesSearchText =
            !searchText ||
            user.username.toLowerCase().includes(searchText.toLowerCase()) ||
            user.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(searchText.toLowerCase());

          const matchesInterests =
            selectedInterests.length === 0 ||
            (user.interests &&
              user.interests.some((interestId) =>
                selectedInterests.some(
                  (selectedInterest) => selectedInterest._id === interestId,
                ),
              ));

          return matchesSearchText && matchesInterests;
        });

        return {
          filteredUsers,
          friends: filteredUsers.filter(
            (user) => user.isIFollowingHim && user.isFollowingMe,
          ),
          usersYouMayKnow: filteredUsers.filter(
            (user) => !user.isIFollowingHim && user.isFollowingMe,
          ),
          usersWithSharedInterests: filteredUsers.filter(
            (user) =>
              user.matchingInterests &&
              user.matchingInterests > 0 &&
              !user.isIFollowingHim,
          ),
          generalSuggestions: filteredUsers.filter(
            (user) =>
              !user.isIFollowingHim &&
              !user.isFollowingMe &&
              (!user.matchingInterests || user.matchingInterests === 0),
          ),
        };
      },
    }),
    {
      name: "users-store",
      storage: isLocalStorageAvailable() ? localStorageCustom : undefined,
    },
  ),
);
