import { useProfileStore } from "@/store/useProfileStore";
import { UserType } from "@/types/UserType";

export const handleProfileFieldChange = (
  key: keyof UserType,
  value: any,
  index?: number,
  subkey?: string, // Ajout d'un sous-clé pour gérer les sous-propriétés comme platform ou url
) => {
  useProfileStore.setState((state: any) => {
    // Gérer les intérêts (interests)
    if (key === "interests" && index !== undefined) {
      const updatedInterests = [...(state.userInfo?.interests || [])];
      updatedInterests[index] = { ...updatedInterests[index], ...value };
      return {
        userInfo: {
          ...state.userInfo,
          interests: updatedInterests,
        },
      };
    }

    // Gérer les socialLinks
    if (key === "socialLinks" && index !== undefined && subkey) {
      const updatedSocialLinks = [...(state.userInfo?.socialLinks || [])];
      updatedSocialLinks[index] = {
        ...updatedSocialLinks[index],
        [subkey]: value, // Mise à jour du sous-champ (platform ou url)
      };
      return {
        userInfo: {
          ...state.userInfo,
          socialLinks: updatedSocialLinks,
        },
      };
    }

    // Gérer les autres champs simples
    return {
      userInfo: {
        ...state.userInfo,
        [key]: value,
      },
    };
  });
};
