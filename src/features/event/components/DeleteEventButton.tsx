"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionProvider";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DeleteEventButton = ({
  eventId,
  isHost,
}: {
  eventId: string;
  isHost: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { token } = useSession();
  const handleDelete = async () => {
    if (!isHost) return;
    setLoading(true);
    try {
      await fetchData(
        `/events/deleteEvent/${eventId}`,
        HttpMethod.DELETE,
        undefined,
        token,
      );
      setLoading(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    }
    if (!isHost) return null;
  };
  return (
    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
      {loading ? <Loader className="animate-spin" /> : "Delete Event"}
    </Button>
  );
};

export default DeleteEventButton;
