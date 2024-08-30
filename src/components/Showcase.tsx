import Section from "@/components/layout/Section";
import Event from "@/features/event/components/Event";
import { EventType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { cn } from "@nextui-org/theme";
import EventPreview from "../features/event/components/EventPreview";
import UserPrevirew from "./UsersList";

const Showcase = ({
  events,
  users,
  preview = true,
  className,
  itemClassName,
}: {
  events?: EventType[];
  users?: UserType[];
  preview?: boolean;
  className?: string;
  itemClassName?: string;
}) => {
  return (
    <Section className="hidden  md:flex">
      <ul
        className={cn(
          "flex flex-col gap-4  md:overflow-x-auto w-full overflow-y-auto",
          {
            "md:grid md:grid-cols-2 lg:grid-cols-3":
              events && events.length > 0,
          },
          className,
        )}
      >
        {events &&
          preview &&
          events.map((event) => (
            <li key={event._id} className={itemClassName}>
              <EventPreview event={event} />
            </li>
          ))}
        {events &&
          !preview &&
          events.map((event) => (
            <li key={event._id} className={itemClassName}>
              <Event event={event} />
            </li>
          ))}
        {users &&
          preview &&
          users.map((user) => (
            <li key={user._id} className={itemClassName}>
              <UserPrevirew user={user} />
            </li>
          ))}
      </ul>
    </Section>
  );
};

export default Showcase;
