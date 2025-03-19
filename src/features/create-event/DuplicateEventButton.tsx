import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface DuplicateEventProps {
  eventId: string;
}

const DuplicateEventButton = ({ eventId }: DuplicateEventProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const handleDuplicateEvent = () => {
    toast({
      description: "Event duplicated successfully",
      className: "bg-evento-gradient-button text-white",
    });
    router.push(`/create-event/${eventId}`);
  };
  return (
    <Button
      onClick={(e) => {
        handleDuplicateEvent();
        e.stopPropagation();
      }}
      className="w-full"
      variant={"eventoPrimary"}
    >
      Duplicate Event
    </Button>
  );
};

export default DuplicateEventButton;
