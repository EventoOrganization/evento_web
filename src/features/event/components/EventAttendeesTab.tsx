// components/EventAttendeesTab.tsx

import CollapsibleList from "@/components/CollapsibleList";
import { EventType } from "@/types/EventType";

interface EventAttendeesTabProps {
  event: EventType;
}

const EventAttendeesTab: React.FC<EventAttendeesTabProps> = ({ event }) => {
  return (
    <div>
      <CollapsibleList
        title="Attendees"
        count={event.attendees?.length || 0}
        users={event.attendees || []}
      />
    </div>
  );
};

export default EventAttendeesTab;
