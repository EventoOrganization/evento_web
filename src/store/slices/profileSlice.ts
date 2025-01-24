import { UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { handleError } from "@/utils/handleError";
import { handleLog } from "@/utils/handleLog";
import { handleWarning } from "@/utils/handleWarning";
import { StateCreator } from "zustand";

export interface ProfileSlice {
  userInfo: UserType | null;
  loadUser: (token: string) => Promise<void>;
  setProfileData: (data: UserType) => void;
  updateFollowingUserIds: (
    userId: string,
    action: "follow" | "unfollow",
  ) => void;
}

export const createProfileSlice: StateCreator<ProfileSlice> = (set) => ({
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
});
