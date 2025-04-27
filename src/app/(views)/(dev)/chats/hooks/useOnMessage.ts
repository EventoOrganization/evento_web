// hooks/useOnMessage.ts
import { useSocket } from "@/app/(views)/(dev)/chats/contexts/SocketProvider";
import { useEffect } from "react";

export function useOnMessage(handler: (msg: any) => void) {
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) return;
    socket.on("send_message_emit", handler);
    return () => {
      socket.off("send_message_emit", handler);
    };
  }, [socket, handler]);
}
