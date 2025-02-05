interface CapacityStatus {
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export const getCapacityStatus = (
  currentGuests: number,
  limit: number,
  isGoing = false,
): CapacityStatus => {
  const adjustedGuests = isGoing ? currentGuests + 1 : currentGuests;

  const percentage = (adjustedGuests / limit) * 100;

  if (percentage <= 30) {
    return {
      label: "SPOTS AVAILABLE",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-600",
    };
  } else if (percentage <= 59) {
    return {
      label: "FILLING UP",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-600",
    };
  } else if (percentage <= 99) {
    return {
      label: "ALMOST FULL",
      bgColor: "bg-orange-100",
      textColor: "text-orange-800",
      borderColor: "border-orange-600",
    };
  } else {
    return {
      label: "FULL",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-600",
    };
  }
};
