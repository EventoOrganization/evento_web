// hooks/useOnMessage.ts
import { useSocket } from "@/app/(views)/(dev)/chats/contexts/SocketProvider";
import { useEffect } from "react";

export function useOnMessage(handler: (msg: any) => void) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    console.log("useOnMessage is running");
    socket.on("new_message", handler);
    return () => {
      socket.off("new_message", handler);
    };
  }, [socket, handler]);
}
