"use client";

import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useSocket } from "../contexts/SocketProvider";
import { useConversations } from "../hooks/useConversations";

export function ConversationsInitializer() {
  const { data, error } = useConversations();
  const { socket, updateConversations } = useSocket();
  const { toast } = useToast();

  useEffect(() => {
    // À chaque changement de `data`, on loggue
    if (data.length > 0) {
      console.log("[Chat] Conversations loaded:", data);
      updateConversations(() => data);
      socket?.emit("join_conversations", {
        conversationIds: data.map((c) => c._id),
      });
    } else {
      console.log("[Chat] No conversations found.");
    }
  }, [data, socket]);

  if (error) {
    console.error("[Chat] Error fetching conversations:", error);
    toast({
      title: "Erreur de chargement",
      description: error.message,
      variant: "destructive",
    });
  }

  return null;
}
