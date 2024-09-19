import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "@/contexts/SessionProvider";
import DiscoverEventPreview from "@/features/discover/DiscoverEventPreview";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import Link from "next/link";
import { useRouter } from "next/navigation";

const EventModal = ({
  event,
  isOpen,
  onClose,
}: {
  event: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
  const { token } = useSession();
  const handleClickInsideModal = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  const handleDelete = async () => {
    try {
      await fetchData(
        `/events/deleteEvent/${event._id}`,
        HttpMethod.DELETE,
        undefined,
        token,
      );
    } catch (err) {
      console.log(err);
    } finally {
      router.push("/profile");
      onClose();
    }
  };
  if (!event) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader className="sr-only">
        <DialogTitle className="sr-only">
          {event.title ? event.title : ""}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {event.details.description ? event.details.description : ""}
        </DialogDescription>
      </DialogHeader>
      <DialogContent
        onClick={handleClickInsideModal}
        className="bg-transparent border-none max-w-[90vw]  md:max-w-screen-md lg:max-w-screen-lg max-h-[calc(100vh-64px)] p-0 w-full h-full"
      >
        <ScrollArea className="rounded h-full">
          <DiscoverEventPreview event={event} className="max-w-[90vw]" />
          {event.isHosted && (
            <Button onClick={handleDelete}>Delete Event</Button>
          )}
        </ScrollArea>
        <div className="grid grid-cols-2 gap-4 items-end">
          <Button variant="ghost" className="bg-gray-200" onClick={onClose}>
            Cancel
          </Button>
          <Button
            asChild
            className="bg-evento-gradient  transition-transform duration-1000"
          >
            <Link href={`/event/${event._id}`}>View Details</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
