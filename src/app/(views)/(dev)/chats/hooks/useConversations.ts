import { useSession } from "@/contexts/(prod)/SessionProvider";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useCallback, useEffect, useState } from "react";
import { ConversationType } from "../types";

export function useConversations() {
  const { token, user } = useSession();
  const [data, setData] = useState<ConversationType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchConvs = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      const res = await fetchData<any[]>(
        "/chats/conversations",
        HttpMethod.GET,
        null,
        token,
      );
      if (!res.ok || !res.data) throw new Error(res.error || "Fetch failed");
      setData(res.data);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    fetchConvs();
  }, [fetchConvs]);

  return { data, loading, error, refetch: fetchConvs };
}
