import { useGlobalStore } from "@/store/useGlobalStore";
import { fetchData, HttpMethod } from "@/utils/fetchData";

export const handleSwitchHideFromProfile = async (
  eventId: string,
  userId: string,
  token: string,
) => {
  const { events, updateEvent, userInfo } = useGlobalStore.getState();
  const pastEvents = [
    ...(userInfo?.pastEventsGoing || []),
    ...(userInfo?.pastEventsHosted || []),
  ];

  const event = [...events, ...pastEvents].find((e) => e._id === eventId);
  if (!event) {
    console.error("Event not found in store");
    return;
  }

  const isHidden = event?.hiddenByUsers?.some((id) => id === userId);
  const updatedHiddenByUsers = isHidden
    ? event?.hiddenByUsers?.filter((id) => id !== userId)
    : [...(event?.hiddenByUsers || []), userId];
  try {
    const response = await fetchData(
      `/events/updateEvent/${eventId}`,
      HttpMethod.PUT,
      { field: "hiddenByUsers", value: userId },
      token,
    );

    if (!response.ok) {
      throw new Error("Failed to update event visibility");
    }

    console.log("Event updated successfully");

    updateEvent(eventId, { hiddenByUsers: updatedHiddenByUsers });
  } catch (error) {
    console.error("Error updating event:", error);
  }
};
