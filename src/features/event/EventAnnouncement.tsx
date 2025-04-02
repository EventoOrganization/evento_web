import EzUserPreview from "@/components/EzUserPreview";
import TruncatedText from "@/components/TruncatedText";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { useUsersStore } from "@/store/useUsersStore";
import { Announcement, EventType } from "@/types/EventType";
import { formatISODate } from "@/utils/dateUtils";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { XIcon } from "lucide-react";
import { useState } from "react";
import QuestionModal from "./components/QuestionModal";
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
  const [activeAnnouncement, setActiveAnnouncement] =
    useState<Announcement | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
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
  // const handleComment = async () => {};
  return (
    <>
      {filteredAnnouncements && filteredAnnouncements.length > 0 && (
        <div className="flex flex-col gap-2">
          {filteredAnnouncements.map((announcement: Announcement) => {
            const sender =
              user && user._id === announcement.senderId
                ? user
                : users.find((u) => u._id === announcement.senderId);
            const hasAlreadyAnswered = !!announcement.responses?.some(
              (response) => response.userId === user?._id,
            );

            if (!sender) return null;
            switch (announcement.type) {
              case "info":
                return (
                  <div
                    key={announcement._id}
                    className="bg-muted border shadow p-2 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <EzUserPreview user={sender} />
                        {isAdmin && (
                          <span className="italic text-xs text-muted-foreground">
                            {announcement.type} to{" "}
                            {announcement.receivers.status}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatISODate(announcement.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <TruncatedText text={announcement.message} />
                      {isAdmin && (
                        <Button
                          variant={"ghost"}
                          onClick={() => {
                            handleDeleteAnnoncement(announcement._id);
                          }}
                        >
                          <XIcon className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );

              case "questionnaire":
                return (
                  <div
                    key={announcement._id}
                    className="bg-muted border shadow p-2 rounded-lg flex flex-col"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <EzUserPreview user={sender} />
                        {isAdmin && (
                          <span className="italic text-xs text-muted-foreground">
                            {announcement.type} to{" "}
                            {announcement.receivers.status}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatISODate(announcement.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <TruncatedText text={announcement.message} />
                      {isAdmin && (
                        <Button
                          variant={"ghost"}
                          onClick={() => {
                            handleDeleteAnnoncement(announcement._id);
                          }}
                        >
                          <XIcon className="w-4 h-4" />
                        </Button>
                      )}
                    </div>{" "}
                    <Button
                      className="self-center w-fit"
                      disabled={hasAlreadyAnswered}
                      variant={hasAlreadyAnswered ? "outline" : "eventoPrimary"}
                      onClick={() => {
                        if (!hasAlreadyAnswered) {
                          setActiveAnnouncement(announcement);
                          setShowQuestionModal(true);
                        }
                      }}
                    >
                      {hasAlreadyAnswered ? "Already answered" : "Respond"}
                    </Button>
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>
      )}
      {showQuestionModal && activeAnnouncement && (
        <QuestionModal
          questions={activeAnnouncement.questions}
          context="announcement"
          onSubmit={async (answers) => {
            console.log("Answers:", answers);
            try {
              const res = await fetchData(
                `/events/announcements/${activeAnnouncement._id}/respond`,
                HttpMethod.POST,
                {
                  eventId: activeAnnouncement.eventId,
                  answers,
                },
                token,
              );

              if (res.ok) {
                toast({
                  title: "Success",
                  description: "Your response has been submitted!",
                  variant: "evento",
                });

                if (setEvent && user?._id) {
                  const updatedAnnouncements = event.announcements?.map((a) => {
                    if (a._id === activeAnnouncement._id) {
                      return {
                        ...a,
                        responses: [
                          ...(a.responses || []),
                          {
                            _id: "",
                            announcementId: activeAnnouncement._id,
                            eventId: activeAnnouncement.eventId,
                            userId: user._id,
                            answers,
                            createdAt: "",
                            updatedAt: "",
                          },
                        ],
                      };
                    }
                    return a;
                  });

                  setEvent({
                    ...event,
                    announcements: updatedAnnouncements,
                  });
                }
              } else {
                toast({
                  title: "Error",
                  description: res.error || "Failed to submit response",
                  variant: "destructive",
                });
              }
            } catch (error) {
              console.error("Error submitting response:", error);
              toast({
                title: "Error",
                description:
                  "Something went wrong while submitting your response.",
                variant: "destructive",
              });
            } finally {
              setShowQuestionModal(false);
              setActiveAnnouncement(null);
            }
          }}
          onClose={() => {
            setShowQuestionModal(false);
            setActiveAnnouncement(null);
          }}
        />
      )}
    </>
  );
};

export default EventAnnouncement;
