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
          {event.title ? event.title : "Preview"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {event.description ? event.description : ""}
        </DialogDescription>
      </DialogHeader>
      <DialogContent className="bg-background p-0 py-0 w-full h-full">
        <ScrollArea className="rounded h-full">
          <h1 className="animate-slideInLeft opacity-0 lg:text-5xl flex justify-center md:justify-start md:font-bold text-black w-full mt-10 px-4">
            Preview
          </h1>
          <CreateEventPreview inModal={true} />
        </ScrollArea>
        <div className="grid grid-cols-2 gap-4 items-end p-4 bg-background">
          <Button
            variant="ghost"
            className="hover:bg-gray-200"
            onClick={onClose}
          >
            Back
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
