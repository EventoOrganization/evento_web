import ShareEventModal from "@/components/ShareEventModal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventsStore";
import { EventType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { startOfDay } from "date-fns";
import {
  Bookmark,
  BookmarkCheck,
  CalendarCheck2,
  CalendarHeart,
  CalendarX2,
  Circle,
  CircleCheck,
  CircleCheckBig,
  Loader2 as Spinner,
} from "lucide-react";
import React, { useState } from "react";
import QuestionModal from "./QuestionModal";
import RefusalModal from "./RefusalModal";

type EventActionIconsProps = {
  event: EventType;
  className?: string;
  updateEventStatusLocally?: (
    statusKey: EventStatusKeys,
    value: boolean,
  ) => void;
  isLocal?: boolean;
};
type EventStatusKeys = "isGoing" | "isFavourite" | "isRefused";

const EventActionIcons: React.FC<EventActionIconsProps> = ({
  event,
  className = "",
  updateEventStatusLocally,
  isLocal = false,
}) => {
  const newVersion = true;
  const { toast } = useToast();
  const { token, user } = useSession();

  const { updateEventStatus: updateEventStatusInStore } = useEventStore();
  const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isRefusalModalOpen, setIsRefusalModalOpen] = useState(false);
  const [refusalReason, setRefusalReason] = useState<string>("");
  const [loading, setLoading] = useState<string | null>(null);
  const hasEventEnded = event.details?.endDate
    ? new Date(event.details.endDate) < startOfDay(new Date())
    : false;

  if (hasEventEnded) {
    return null;
  }
  const updateEventStatus = async (
    status: EventStatusKeys,
    rsvpAnswers?: any,
    reason?: string,
  ) => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!event || !event._id) {
      console.error("Event is null or does not have an _id");
      return;
    }

    if (!user || !user._id) {
      console.error("User is null or does not have an _id");
      return;
    }

    const isCurrentlySet = event[status];
    console.log("status", status);
    try {
      setLoading(status);
      const body = {
        eventId: event._id,
        userId: user._id,
        status: isCurrentlySet ? null : status,
        rsvpAnswers,
        reason,
      };
      const response = await fetchData(
        `/events/updateEventStatus`,
        HttpMethod.POST,
        body,
        token,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const action = isCurrentlySet ? "removed from" : "marked as";
      toast({
        title: `Event ${
          status === "isGoing"
            ? `${action} going`
            : status === "isFavourite"
              ? `${action} favourite`
              : `${action} refused`
        }`,
        className: "bg-evento-gradient text-white",
        duration: 1000,
      });

      if (isLocal && updateEventStatusLocally) {
        updateEventStatusLocally(status, !isCurrentlySet);
        if (!user || !user._id) {
          console.error("❌ User is null or does not have an _id");
          return;
        }
        updateEventStatusInStore(
          event._id,
          { [status]: !isCurrentlySet },
          user as UserType,
        );
      } else {
        if (!user || !user._id) {
          console.error("❌ User is null or does not have an _id");
          return;
        }
        updateEventStatusInStore(
          event._id,
          { [status]: !isCurrentlySet },
          user as UserType,
        );
      }
    } catch (error) {
      console.error(`Error updating event status (${status}):`, error);
    } finally {
      setLoading(null);
    }
  };

  const handleGoing = (submittedAnswers: any) => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }
    if (
      !event.isGoing &&
      event?.questions?.length !== undefined &&
      event?.questions?.length > 0 &&
      submittedAnswers.length < event.questions.length
    ) {
      setShowQuestionModal(true);
      return;
    }

    updateEventStatus("isGoing", submittedAnswers);
  };

  const handleFavourite = () => {
    updateEventStatus("isFavourite");
  };

  const handleRefused = async () => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      await updateEventStatus("isRefused", [], refusalReason);
      setRefusalReason("");
    } catch (error) {
      console.error("Error marking event as refused:", error);
      alert("Failed to mark as refused. Please try again.");
    }
  };

  const handleSubmitQuestions = (answers: any) => {
    if (answers.length > 0) {
      updateEventStatus("isGoing", answers);
    }
    setShowQuestionModal(false);
  };

  return (
    <>
      <div
        className={cn(`flex gap-2  ${className}`, {
          "w-full ": newVersion,
        })}
      >
        {event.eventType === "public" ? (
          <>
            <Button
              onClick={(e) => {
                handleGoing([]);
                e.stopPropagation();
              }}
              variant={"outline"}
              className={cn(
                "relative flex items-center justify-center bg-muted w-full hover:opacity-80 text-sm  border-eventoPurpleLight ",
                {
                  "w-10 h-10": !newVersion,
                  "bg-evento-gradient-button text-white hover:text-white":
                    event.isGoing,
                  "text-eventoPurpleLight hover:text-eventoPurpleLight":
                    !event.isGoing,
                },
              )}
            >
              {loading === "isGoing" && (
                <Spinner
                  className={cn("animate-spin w-5 h-5", {
                    "text-white": event.isGoing,
                    "text-eventoPurpleLight": !event.isGoing,
                  })}
                />
              )}
              {!event.isGoing ? (
                <>
                  {newVersion ? (
                    <>Click to Join</>
                  ) : (
                    <CircleCheck
                      strokeWidth={1.5}
                      className={cn("text-eventoPurpleLight w-full h-full")}
                    />
                  )}
                </>
              ) : (
                <>
                  {newVersion ? (
                    <>
                      <CalendarCheck2 className="w-5 h-5 text-white mr-2" />{" "}
                      Going
                    </>
                  ) : (
                    <CircleCheckBig
                      strokeWidth={1.5}
                      className={cn(
                        "text-white bg-evento-gradient rounded-full w-full h-full",
                      )}
                    />
                  )}
                </>
              )}
            </Button>
            <Button
              onClick={(e) => {
                handleFavourite();
                e.stopPropagation();
              }}
              variant={"outline"}
              className={cn(
                "relative flex items-center justify-center bg-muted px-3 hover:opacity-80 text-sm  border-black",
                {
                  "w-10 h-10": !newVersion,
                  "bg-evento-gradient-button text-white hover:text-white border-eventoPurpleLight ":
                    event.isFavourite,
                  // "text-eventoPurpleLight hover:text-eventoPurpleLight":
                  // !event.isFavourite,
                },
              )}
            >
              {loading === "isFavourite" ? (
                <Spinner
                  className={cn("animate-spin w-5 h-5", {
                    "text-white": event.isFavourite,
                    "text-eventoPurpleLight": !event.isFavourite,
                  })}
                />
              ) : event.isFavourite ? (
                <BookmarkCheck className=" text-white w-5 h-5" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
              {!newVersion && (
                <Circle
                  strokeWidth={1.5}
                  className={cn(
                    "absolute inset-0 text-eventoPurpleLight rounded-full w-full h-full",
                    {
                      "bg-evento-gradient text-white": event.isFavourite,
                    },
                  )}
                />
              )}
            </Button>
          </>
        ) : (
          <>
            {!token ? (
              <Button
                variant={"outline"}
                className="border flex p-2 rounded justify-center items-center w-full"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Respond
              </Button>
            ) : (
              <Select
                onValueChange={(value) => {
                  if (value === "going") handleGoing([]);
                  if (value === "favourite") handleFavourite();
                  if (value === "refuse") setIsRefusalModalOpen(true);
                }}
              >
                <SelectTrigger
                  className={cn(
                    "relative flex p-2 rounded justify-center items-center w-full border overflow-hidden",
                    {
                      "bg-evento-gradient-button text-white": event.isGoing,
                      "bg-eventoPurpleDark text-white":
                        event.isFavourite || event.isRefused,
                    },
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {/* Bordure animée */}
                  {!event.isGoing && !event.isFavourite && !event.isRefused && (
                    <span
                      className="absolute inset-0 rounded border-[3px] border-transparent animate-pulse"
                      style={{
                        background:
                          "linear-gradient(white, white) padding-box, linear-gradient(var(--gradient-angle, 160deg), #A62BA7, #5973D3) border-box",
                        maskImage: "linear-gradient(white, white)",
                        WebkitMaskImage: "linear-gradient(white, white)",
                      }}
                    />
                  )}

                  {/* Contenu du bouton */}
                  <span className="relative z-10">
                    <SelectValue
                      placeholder={
                        event.isGoing ? (
                          <div className="flex">
                            <CalendarCheck2 className="w-5 h-5 text-white mr-2" />{" "}
                            Going
                          </div>
                        ) : event.isFavourite ? (
                          <div className="flex">
                            <CalendarHeart className="w-5 h-5 text-white mr-2" />
                            Maybe
                          </div>
                        ) : event.isRefused ? (
                          <div className="flex">
                            <CalendarX2 className="w-5 h-5 text-white mr-2" />
                            Declined
                          </div>
                        ) : (
                          "Respond to this event"
                        )
                      }
                    />
                  </span>
                </SelectTrigger>

                <SelectContent className="z-50 text-black">
                  <SelectItem value="going">
                    <div className="flex">
                      {loading === "isGoing" ? (
                        <Spinner className="animate-spin w-5 h-5" />
                      ) : (
                        <>
                          <CalendarCheck2 className="w-5 h-5  mr-2" /> Going{" "}
                        </>
                      )}
                    </div>
                  </SelectItem>
                  <SelectItem value="favourite">
                    <div className="flex ">
                      {loading === "isFavourite" ? (
                        <Spinner className="animate-spin w-5 h-5" />
                      ) : (
                        <>
                          <CalendarHeart className="w-5 h-5  mr-2" />
                          Maybe
                        </>
                      )}
                    </div>
                  </SelectItem>
                  <SelectItem value="refuse">
                    <div className="flex ">
                      {loading === "isRefused" ? (
                        <Spinner className="animate-spin w-5 h-5" />
                      ) : (
                        <>
                          <CalendarX2 className="w-5 h-5  mr-2" />
                          Declined
                        </>
                      )}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </>
        )}
        <ShareEventModal eventId={event._id} />

        {/* Modals for authentication, questions, and refusal */}
        {isAuthModalOpen && (
          <AuthModal
            onClose={() => setIsAuthModalOpen(false)}
            onAuthSuccess={() => setIsAuthModalOpen(false)}
            quickSignup
          />
        )}

        {showQuestionModal && (
          <QuestionModal
            questions={event?.questions || []}
            onSubmit={handleSubmitQuestions}
            onClose={() => setShowQuestionModal(false)}
          />
        )}

        {isRefusalModalOpen && (
          <RefusalModal
            isOpen={isRefusalModalOpen}
            onClose={() => setIsRefusalModalOpen(false)}
            setRefusalReason={setRefusalReason}
            onSubmit={handleRefused}
            refusalReason={refusalReason}
          />
        )}
      </div>
    </>
  );
};

export default EventActionIcons;
