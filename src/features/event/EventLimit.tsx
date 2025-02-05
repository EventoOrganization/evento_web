import { getCapacityStatus } from "@/utils/availabilityStatus";

interface EventLimitProps {
  currentGuests: number;
  limitedGuests: number | null;
}

const EventLimit = ({ currentGuests, limitedGuests }: EventLimitProps) => {
  const status = getCapacityStatus(currentGuests, limitedGuests || 0);

  return (
    <div
      className={`flex items-center justify-center 
      border rounded px-2 py-1
      ${status.bgColor} ${status.textColor} ${status.borderColor} 
      font-semibold text-sm text-center `}
    >
      {status.label}
    </div>
  );
};

export default EventLimit;
