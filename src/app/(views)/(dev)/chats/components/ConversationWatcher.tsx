import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSocket } from "../contexts/SocketProvider";

export function ConversationWatcher() {
  const pathname = usePathname();
  const { setActiveConversation } = useSocket();

  useEffect(() => {
    if (!pathname.startsWith("/chats")) {
      console.log(
        "[ConversationWatcher] ❌ User left chats, resetting active conversation...",
      );
      setActiveConversation(null);
    }
  }, [pathname, setActiveConversation]);

  return null;
}
