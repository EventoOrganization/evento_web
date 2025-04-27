// hooks/useJoinConversations.ts
import { useSocket } from "@/app/(views)/(dev)/chats/contexts/SocketProvider";
import { useEffect } from "react";

export function useJoinConversations(conversationIds: string[]) {
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket || !conversationIds.length) return;
    socket.emit("join_conversations", { conversationIds });
  }, [socket, conversationIds]);
}
