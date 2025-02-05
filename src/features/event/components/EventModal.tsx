import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import DiscoverEventPreview from "@/features/discover/DiscoverEventPreview";
import Link from "next/link";
const EventModal = ({
  event,
  isOpen,
  onClose,
}: {
  event: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const handleClickInsideModal = (e: React.MouseEvent) => {
    e.stopPropagation();
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
