import { UserType } from "@/types/UserType";

export const sortUsersByPriority = (users: UserType[]): UserType[] => {
  return users.sort((a, b) => {
    const aFollowing = a.isIFollowingHim ? 1 : 0;
    const aFollowedBy = a.isFollowingMe ? 1 : 0;
    const bFollowing = b.isIFollowingHim ? 1 : 0;
    const bFollowedBy = b.isFollowingMe ? 1 : 0;

    const aPriority = aFollowing + aFollowedBy;
    const bPriority = bFollowing + bFollowedBy;

    return bPriority - aPriority;
  });
};
