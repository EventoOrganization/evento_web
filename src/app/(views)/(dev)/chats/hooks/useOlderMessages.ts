"use client";

import { useSession } from "@/contexts/(prod)/SessionProvider";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useCallback, useState } from "react";
import { MessageType } from "../types";

interface FetchOlderMessagesResponse {
  messages: MessageType[];
  hasMore: boolean;
}

export function useOlderMessages(conversationId: string | null) {
  const { token } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchOlderMessages = useCallback(
    async (before: string): Promise<FetchOlderMessagesResponse> => {
      if (!token || !conversationId) return { messages: [], hasMore: false };

      setLoading(true);
      try {
        const res = await fetchData<FetchOlderMessagesResponse>(
          `/chats/messages?conversationId=${conversationId}&before=${before}`,
          HttpMethod.GET,
          null,
          token,
        );
        if (!res.ok || !res.data) throw new Error(res.error || "Fetch failed");
        setError(null);
        return res.data;
      } catch (err: any) {
        setError(err);
        return { messages: [], hasMore: false };
      } finally {
        setLoading(false);
      }
    },
    [token, conversationId],
  );

  return { fetchOlderMessages, loading, error };
}
