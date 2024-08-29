import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Event from "./Event";

const EventModal = ({
  event,
  isOpen,
  onClose,
}: {
  event: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw]  md:max-w-screen-md lg:max-w-screen-lg max-h-[calc(100vh-64px)] p-0 w-full h-full">
        <ScrollArea className="rounded h-full">
          <Event event={event} className="max-w-[90vw] " />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;