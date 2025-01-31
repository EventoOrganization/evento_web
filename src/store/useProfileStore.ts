import { EventType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { handleError } from "@/utils/handleError";
import { handleLog } from "@/utils/handleLog";
import { handleWarning } from "@/utils/handleWarning";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export interface ProfileState {
  userInfo: UserType | null;
  loadUser: (token: string) => Promise<void>;
  setProfileData: (data: UserType) => void;
  updateFollowingUserIds: (
    userId: string,
    action: "follow" | "unfollow",
  ) => void;
  updatePastEvents: (eventId: string, updatedEvent: Partial<EventType>) => void;
}
const isLocalStorageAvailable = () => {
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

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      userInfo: null,

      loadUser: async (token) => {
        try {
          handleLog("🔍 Loading user profile...");
          const res = await fetchData(
            `/profile/getLoggedUserProfile`,
            HttpMethod.GET,
            null,
            token,
          );

          if (res.ok) {
            set({ userInfo: res.data as UserType });
            handleLog("✅ User profile loaded successfully!");
          } else {
            handleWarning({
              message: "⚠️ Failed to load user profile",
              source: "loadUser",
              originalError: res.error,
            });
          }
        } catch (error) {
          handleError(error, "loadUser");
        }
      },

      setProfileData: (data) => {
        try {
          handleLog("📝 Replacing user profile...");
          set({ userInfo: data });
          handleLog("✅ User profile replaced successfully!");
        } catch (error) {
          handleError(error, "setProfileData");
        }
      },

      updateFollowingUserIds: (userId, action) => {
        try {
          set((state) => {
            if (!state.userInfo) {
              handleWarning({
                message: "⚠️ Cannot update following list: userInfo is null",
                source: "updateFollowingUserIds",
              });
              return state;
            }

            handleLog(
              `🔄 ${action === "follow" ? "Following" : "Unfollowing"} user ${userId}...`,
            );

            const currentFollowingIds = state.userInfo.followingUserIds || [];
            const updatedFollowingIds =
              action === "follow"
                ? [...currentFollowingIds, userId]
                : currentFollowingIds.filter((id) => id !== userId);

            handleLog(
              `✅ User ${userId} ${action === "follow" ? "followed" : "unfollowed"} successfully!`,
            );

            return {
              userInfo: {
                ...state.userInfo,
                followingUserIds: updatedFollowingIds,
              },
            };
          });
        } catch (error) {
          handleError(error, "updateFollowingUserIds");
        }
      },
      updatePastEvents: (eventId: string, updatedEvent: Partial<EventType>) => {
        try {
          set((state) => {
            if (!state.userInfo) {
              handleWarning({
                message: "⚠️ Cannot update past events: userInfo is null",
                source: "updatePastEvents",
              });
              return state;
            }

            handleLog(`🔄 Updating past events for event ${eventId}...`);

            return {
              userInfo: {
                ...state.userInfo,
                pastEventsGoing: state.userInfo.pastEventsGoing
                  ? state.userInfo.pastEventsGoing.map((event) =>
                      event._id === eventId
                        ? { ...event, ...updatedEvent }
                        : event,
                    )
                  : [],
                pastEventsHosted: state.userInfo.pastEventsHosted
                  ? state.userInfo.pastEventsHosted.map((event) =>
                      event._id === eventId
                        ? { ...event, ...updatedEvent }
                        : event,
                    )
                  : [],
              },
            };
          });

          handleLog("✅ Past events updated successfully!");
        } catch (error) {
          handleError(error, "updatePastEvents");
        }
      },
    }),
    {
      name: "profile-store",
      storage: isLocalStorageAvailable() ? localStorageCustom : undefined,
    },
  ),
);
