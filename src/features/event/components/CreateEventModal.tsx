import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreateEventPreview from "./CreateEventPreview";

const CreateEventModal = ({
  event,
  isOpen,
  onSuccess,
  onClose,
}: {
  event: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (e: React.FormEvent) => void;
}) => {
  if (!event) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader className="sr-only">
        <DialogTitle className="sr-only">
          {event.title ? event.title : ""}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {event.description ? event.description : ""}
        </DialogDescription>
      </DialogHeader>
      <DialogContent className="bg-transparent border-none max-w-[90vw]  md:max-w-screen-md lg:max-w-screen-lg max-h-[calc(100vh-64px)] p-0 w-full h-full">
        <ScrollArea className="rounded h-full">
          <CreateEventPreview inModal={true} />
        </ScrollArea>
        <div className="grid grid-cols-2 gap-4 items-end">
          <Button variant="ghost" className="bg-gray-200" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={(e) => onSuccess && onSuccess(e)}
            className="bg-evento-gradient  transition-transform duration-1000"
          >
            Create Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;
