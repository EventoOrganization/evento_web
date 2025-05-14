import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/togglerbtn";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { EventType } from "@/types/EventType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { usePathname } from "next/navigation";
import { useState } from "react";
interface IncludeChatToggleProps {
  event?: EventType;
  onUpdateField: (field: string, value: any) => void;
}
const IncludeChatToggle = ({
  event,
  onUpdateField,
}: IncludeChatToggleProps) => {
  const pathname = usePathname();
  const { toast } = useToast();
  const { token } = useSession();
  const isCreatingEvent = pathname.startsWith("/create-event");
  const [isIncludeChat, setisIncludeChat] = useState(
    event?.details?.includeChat || false,
  );
  const handleIncludeChatChange = async (value: boolean) => {
    setisIncludeChat(value);
    if (isCreatingEvent) {
    } else {
      if (!event) return;
      try {
        await fetchData(
          `/events/updateEvent/${event._id}`,
          HttpMethod.PUT,
          { field: "includeChat", value },
          token,
        );
        onUpdateField("includeChat", value);
        toast({
          description: "Event updated successfully!",
          variant: "evento",
          duration: 3000,
        });
      } catch (error) {
        console.error("Error updating event:", error);
        toast({
          description: "Error updating event",
          variant: "destructive",
          duration: 3000,
        });
      } finally {
      }
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Switch
          checked={isIncludeChat}
          onCheckedChange={handleIncludeChatChange}
          className="mt-1"
        />
        <Label>Include Chat</Label>
      </div>
    </div>
  );
};
export default IncludeChatToggle;
