// hooks/useSendMessage.ts
import { useSocket } from "@/app/(views)/(dev)/chats/contexts/SocketProvider";
import { useCallback } from "react";

export function useSendMessage() {
  const { socket } = useSocket();
  return useCallback(
    (data: {
      message: string;
      senderId: string;
      conversationId: string;
      messageType: string;
    }) => {
      socket?.emit("send_message", data);
    },
    [socket],
  );
}
