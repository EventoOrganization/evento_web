// components/ChatInitializer.tsx
"use client";

import { useSocket } from "@/app/(views)/(dev)/chats/contexts/SocketProvider";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useEffect } from "react";

export const ChatInitializer = () => {
  const { token, user } = useSession();
  const { updateConversations } = useSocket();

  useEffect(() => {
    if (!token || !user) return;

    const load = async () => {
      const result = await fetchData<any[]>(
        "/chats/fetchConversations",
        HttpMethod.GET,
        null,
        token,
      );
      if (!result.ok || !result.data) return;

      const structured = result.data
        .filter((c) => c.senderId && c.reciverId)
        .map((conv) => {
          const isSender = conv.senderId._id === user._id;
          const other = isSender ? conv.reciverId : conv.senderId;
          const base = {
            _id: conv._id,
            title: conv.groupId
              ? conv.groupId.groupName || "Group Chat"
              : other.username,
            messages: conv.recentMessages || [],
            lastMessage: conv.recentMessages?.[0]?.message || "",
            initialMedia: conv.groupId
              ? conv.groupId.eventId?.initialMedia || []
              : [{ url: other.profileImage || "/evento-logo.png" }],
          };
          return base;
        });

      updateConversations(() => structured);
    };

    load();
  }, [token, user, updateConversations]);

  return null;
};
