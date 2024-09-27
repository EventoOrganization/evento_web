// action.ts
export const getConversationDetails = (conversation: any, user: any) => {
  let title = "";
  let profileImageUrl = "";

  if (conversation.groupId) {
    title = conversation.groupId.groupName || "Group Chat";
    profileImageUrl =
      conversation.groupId.eventId?.initialMedia?.[0]?.url ||
      "/defaultImage.png";
  } else {
    const isSender = conversation.senderId._id === user?._id;
    const otherUser = isSender ? conversation.reciverId : conversation.senderId;

    title = otherUser.username || "Private Chat";
    profileImageUrl = otherUser.profileImage || "/defaultImage.png";
  }

  return { title, profileImageUrl };
};
