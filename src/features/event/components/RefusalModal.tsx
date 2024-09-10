import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const RefusalModal = ({
  isOpen,
  onClose,
  onSubmit,
  setRefusalReason,
  refusalReason,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  setRefusalReason: (reason: string) => void;
  refusalReason: string;
}) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Refuse Event</DialogTitle>
          <DialogDescription>
            Please provide a reason for refusing this event (optional).
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={refusalReason}
          onChange={(e) => setRefusalReason(e.target.value)}
          placeholder="Enter your reason..."
          className="w-full mt-2"
        />
        <DialogFooter className="space-x-2">
          <Button
            onClick={() => {
              onSubmit(refusalReason);
              onClose();
            }}
            variant="ghost"
          >
            {refusalReason.length === 0 ? "Skip" : "Submit"}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RefusalModal;
