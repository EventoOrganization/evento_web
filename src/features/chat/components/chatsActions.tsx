import { fetchData, HttpMethod } from "@/utils/fetchData";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type UpdateConversations = (func: (prevConversations: any[]) => any[]) => void;
type SetActiveConversation = React.Dispatch<React.SetStateAction<any | null>>;
interface StartConversationResponse {
  conversation: {
    _id: string;
    reciverId?: {
      _id: string;
      username: string;
      profileImage: string;
    };
  };
}

export const startPrivateChat = async (
  userId: string,
  token: string | null,
  updateConversations: UpdateConversations,
  setActiveConversation: SetActiveConversation,
  router: AppRouterInstance,
  setSearchTerm?: (value: string) => void,
) => {
  try {
    const result = await fetchData<StartConversationResponse>(
      "/chats/startPrivateConversation",
      HttpMethod.POST,
      { userId },
      token,
    );
    if (result.ok && result.data) {
      console.log("Private chat started:", result.data);
      const conversation = result.data.conversation;
      const newConversation = {
        _id: conversation._id,
        title: `${conversation.reciverId?.username}`,
        lastMessage: "No messages yet",
        initialMedia: [
          {
            url: conversation.reciverId?.profileImage || "/icon-384x384.png",
          },
        ],
      };

      // Add the new conversation to the conversations list
      updateConversations((prev) => [...prev, newConversation]);

      // Set the new conversation as the active conversation
      setActiveConversation(newConversation);

      // Navigate to the new conversation
      router.push(`/chats?conversationId=${result.data.conversation._id}`);

      // Reset search term if provided
      if (setSearchTerm) {
        setSearchTerm("");
      }
    }
  } catch (err) {
    console.error("Error starting private chat:", err);
  }
};
