// ConversationWatcher.tsx
"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useSocket } from "../contexts/SocketProvider";

export function ConversationWatcher() {
  const pathname = usePathname();
  const { setActiveConversation } = useSocket();
  const didResetRef = useRef(false);

  useEffect(() => {
    const isInChats = pathname.startsWith("/chats");

    if (!isInChats && !didResetRef.current) {
      console.log(
        "[ConversationWatcher] ❌ User left chats, resetting active conversation...",
      );
      setActiveConversation(null);
      didResetRef.current = true; // on ne reset plus tant qu’on n’est pas retourné dans /chats
    }

    if (isInChats && didResetRef.current) {
      // Si on revient dans /chats, on autorise un futur reset au prochain leave
      didResetRef.current = false;
    }
  }, [pathname, setActiveConversation]);

  return null;
}
