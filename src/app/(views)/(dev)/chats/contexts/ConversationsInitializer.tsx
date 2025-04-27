"use client";

import EventoLoader from "@/components/EventoLoader";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useConversations } from "../hooks/useConversations";
import { useSocket } from "./SocketProvider";

export function ConversationsInitializer() {
  const { data, loading, error } = useConversations();
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
  }, [data, socket, updateConversations]);

  if (loading) {
    console.log("[Chat] Fetching conversations…");
    return <EventoLoader />;
  }

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
