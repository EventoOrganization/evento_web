"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionProvider";
import { useToast } from "@/hooks/use-toast"; // Si vous avez un hook pour les toasts
import { useGlobalStore } from "@/store/useGlobalStore";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DeleteEventButton = ({
  eventId,
  isHost,
  className,
}: {
  eventId: string;
  isHost: boolean;
  className?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { token } = useSession();
  const deleteEventFromStore = useGlobalStore((state) => state.deleteEvent);
  const { toast } = useToast();
  if (!isHost) {
    return null;
  }
  const handleDelete = async () => {
    if (!isHost) return;
    setLoading(true);
    try {
      console.log("Attempting to delete event with id:", eventId);
      await fetchData(
        `/events/deleteEvent/${eventId}`,
        HttpMethod.DELETE,
        undefined,
        token,
      );
      deleteEventFromStore(eventId); // Suppression dans le store
      setLoading(false);
      toast({
        title: "Event Deleted",
        description: "The event was successfully deleted.",
        className: "bg-green-500 text-white",
        duration: 3000,
      });
      console.log("Event deleted successfully from the store");
      router.refresh();
    } catch (error) {
      console.error("Error deleting event:", error);
      setLoading(false);
      toast({
        title: "Error",
        description: "There was an error deleting the event.",
        className: "bg-red-500 text-white",
        duration: 3000,
      });
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
      disabled={loading}
      className={className}
    >
      {loading ? <Loader className="animate-spin" /> : "Delete Event"}
    </Button>
  );
};

export default DeleteEventButton;
