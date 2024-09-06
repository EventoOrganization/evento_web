import { useProfileStore } from "@/store/useProfileStore";
import { UserType } from "@/types/UserType";

export const handleProfileFieldChange = (
  key: keyof UserType,
  value: any,
  index?: number,
) => {
  useProfileStore.setState((state: any) => {
    if (key === "interests" && index !== undefined) {
      const updatedInterests = [...(state.userInfo?.interests || [])];
      updatedInterests[index] = { ...updatedInterests[index], ...value };
      return {
        userInfo: {
          ...state.userInfo,
          interests: updatedInterests,
        },
      };
    } else {
      return {
        userInfo: {
          ...state.userInfo,
          [key]: value,
        },
      };
    }
  });
};
