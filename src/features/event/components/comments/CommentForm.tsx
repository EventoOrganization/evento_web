// components/comments/CommentForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useState } from "react";

type Props = {
  eventId: string;
  parentId?: string;
  onSuccess?: (newComment: any) => void;
};

export default function CommentForm({ eventId, onSuccess }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useSession();
  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await fetchData(
        `/events/${eventId}/comments`,
        HttpMethod.POST,
        {
          eventId,
          content,
        },
        token,
      );
      if (res.ok && res.data) {
        onSuccess?.(res.data);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setLoading(false);
      setContent("");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        className="border rounded-md p-2 text-sm"
      />
      <Button
        onClick={handleSubmit}
        disabled={loading}
        variant={"eventoPrimary"}
      >
        {loading ? "Sending..." : "Send"}
      </Button>
    </div>
  );
}
