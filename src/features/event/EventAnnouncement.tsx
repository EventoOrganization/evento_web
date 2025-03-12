import EventoSpinner from "@/components/EventoSpinner";
import SmartImage from "@/components/SmartImage";
import TruncatedText from "@/components/TruncatedText";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/contexts/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { useUsersStore } from "@/store/useUsersStore";
import { Announcement, EventType } from "@/types/EventType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { Trash } from "lucide-react";
interface EventAnnouncementProps {
  event: EventType;
  isAdmin?: boolean;
  setEvent?: (event: EventType) => void;
}
const EventAnnouncement = ({
  event,
  isAdmin,
  setEvent,
}: EventAnnouncementProps) => {
  const { user, token } = useSession();
  const { users } = useUsersStore();
  const { toast } = useToast();
  const filteredAnnouncements =
    event.announcements &&
    event.announcements.filter((announcement) => {
      if (isAdmin) return true;
      if (!user) return false;

      const isDirectRecipient = announcement.receivers.userIds?.includes(
        user._id,
      );
      const hasMatchingStatus =
        announcement.receivers.status &&
        ((announcement.receivers.status === "going" && event.isGoing) ||
          (announcement.receivers.status === "invited" && event.isFavourite) ||
          (announcement.receivers.status === "decline" && event.isRefused));

      return isDirectRecipient || hasMatchingStatus;
    });
  const handleDeleteAnnoncement = async (announcementId: string) => {
    try {
      const response = await fetchData<any>(
        `/events/announcements/${announcementId}`,
        HttpMethod.DELETE,
        null,
        token,
      );
      if (response.ok) {
        toast({
          title: "Announcement deleted successfully",
          variant: "evento",
        });

        if (setEvent) {
          setEvent({
            ...event,
            announcements: event?.announcements?.filter(
              (a) => a._id !== announcementId,
            ),
          });
        }
      } else {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast({
        title: "Error",
        description: "Failed to delete announcement",
        variant: "destructive",
      });
    }
  };

  // const handleDeleteComment = async (commentId: string) => {};
  const handleComment = async () => {};
  return (
    <>
      {filteredAnnouncements && filteredAnnouncements.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-eventoPink text-base">New Update</h3>
          {filteredAnnouncements.map((announcement: Announcement) => {
            const sender =
              user && user._id === announcement.senderId
                ? user
                : users.find((u) => u._id === announcement.senderId);

            return (
              <div
                key={announcement._id}
                className="bg-muted border-none shadow-none p-2 rounded-lg"
              >
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    {sender ? (
                      <SmartImage
                        src={sender.profileImage || "/evento-logo.png"}
                        alt={sender.username || "User"}
                        width={30}
                        height={30}
                        className="w-6 h-6 rounded-full"
                        forceImg
                      />
                    ) : (
                      <Avatar>
                        <AvatarImage
                          src={"/evento-logo.png"}
                          className="rounded-full w-6 h-6"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    )}
                    <p className="font-bold">
                      {sender?.username || "Unknown User"}
                    </p>
                  </div>
                  {isAdmin && (
                    <Button
                      variant={"ghost"}
                      onClick={() => {
                        handleDeleteAnnoncement(announcement._id);
                      }}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      <span className="hidden md:flex">Delete</span>
                    </Button>
                  )}
                </div>
                <TruncatedText
                  expand
                  className="mt-2 text-sm text-muted-foreground pl-8 "
                  text={announcement.message}
                />

                {announcement.comments && announcement.comments.length > 0 && (
                  <Accordion type="single" collapsible className="p-0">
                    <AccordionItem value="comments">
                      <AccordionTrigger
                        className="text-sm text-eventoPink justify-end p-0"
                        onClick={() => {
                          toast({
                            title: "In progress",
                            description: `This button will show comments in the future`,
                            variant: "evento",
                          });
                        }}
                      >
                        {announcement.comments.length} comments
                      </AccordionTrigger>
                      {announcement.comments.length > 0 && (
                        <AccordionContent>
                          {announcement.comments.map((comment) => (
                            <>
                              {comment.userId ? (
                                <SmartImage
                                  src={
                                    users.find((u) => u._id === comment.userId)
                                      ?.profileImage || "/evento-logo.png"
                                  }
                                  alt={
                                    users.find((u) => u._id === comment.userId)
                                      ?.username || "User"
                                  }
                                  width={30}
                                  height={30}
                                  className="w-8 h-8 rounded-full"
                                  forceImg
                                />
                              ) : (
                                <Avatar>
                                  <AvatarImage
                                    src={"/evento-logo.png"}
                                    className="rounded-full w-8 h-8"
                                  />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                              )}
                              <p>{comment.content}</p>
                            </>
                          ))}
                        </AccordionContent>
                      )}
                    </AccordionItem>
                  </Accordion>
                )}
                <div className="flex items-center gap-2 py-2 pl-8">
                  {user ? (
                    <SmartImage
                      src={user.profileImage || "/evento-logo.png"}
                      alt={user.username || "User"}
                      width={30}
                      height={30}
                      className="w-6 h-6 rounded-full"
                      forceImg
                    />
                  ) : (
                    <Avatar>
                      <AvatarImage
                        src={"/evento-logo.png"}
                        className="rounded-full w-6 h-6"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  )}
                  <Input type="text" placeholder="Add a comment" disabled />
                  <Button
                    variant={"eventoPrimary"}
                    onClick={() => {
                      handleComment();
                    }}
                  >
                    <EventoSpinner />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default EventAnnouncement;
