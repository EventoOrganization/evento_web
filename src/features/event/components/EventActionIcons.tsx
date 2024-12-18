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
import { useGlobalStore } from "@/store/useGlobalStore";
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
  const updateEventStatusInStore = useGlobalStore(
    (state) => state.updateEventStatus,
  );
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
    console.log("token", token);
    const isCurrentlySet = event[status];

    try {
      setLoading(status);
      const body = {
        eventId: event._id,
        userId: user?._id,
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
        updateEventStatusInStore(
          event._id,
          { [status]: !isCurrentlySet },
          user as UserType,
        );
      } else {
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

  const handleSend = async () => {
    const eventUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/event/${event?._id}`;

    const shareApiSupported = true; // to check if the share api is supported

    if (shareApiSupported && navigator.share) {
      try {
        await navigator.share({
          title: "Check out this event",
          text: "Check out this event!",
          url: eventUrl,
        });
        console.log("Successful share");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else if (navigator.clipboard) {
      // Utiliser le presse-papier si le partage n'est pas supporté
      try {
        await navigator.clipboard.writeText(eventUrl);
        toast({
          title: "Link copied to clipboard!",
          description: "The event link has been copied. You can share it now.",
          className: "bg-evento-gradient text-white",
          duration: 3000,
        });
      } catch (error) {
        console.error("Failed to copy link:", error);
        toast({
          title: "Failed to copy",
          description: "Unable to copy the link to the clipboard.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } else {
      console.log("Clipboard API is not supported in this browser.");
      toast({
        title: "Sharing not supported",
        description: "Your browser does not support sharing or copying links.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleSubmitQuestions = (answers: any) => {
    setShowQuestionModal(false);
    handleGoing(answers);
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
            <Select
              onValueChange={(value) => {
                if (value === "going") handleGoing([]);
                if (value === "favourite") handleFavourite();
                if (value === "refuse") setIsRefusalModalOpen(true);
              }}
            >
              <SelectTrigger
                className={cn(
                  "border flex p-2 rounded justify-center items-center w-full",
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
                <SelectValue
                  className={cn()}
                  placeholder={
                    event.isGoing ? (
                      <div className="flex ">
                        <CalendarCheck2 className="w-5 h-5 text-white mr-2" />{" "}
                        Going
                      </div>
                    ) : event.isFavourite ? (
                      <div className="flex ">
                        <CalendarHeart className="w-5 h-5 text-white mr-2" />
                        Maybe
                      </div>
                    ) : event.isRefused ? (
                      <div className="flex ">
                        <CalendarX2 className="w-5 h-5 text-white mr-2" />
                        Declined
                      </div>
                    ) : (
                      "Respond"
                    )
                  }
                />
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
          </>
        )}

        <Button
          onClick={(e) => {
            handleSend();
            e.stopPropagation();
          }}
          variant={"outline"}
          className={cn(
            "relative flex items-center justify-center bg-muted px-3 hover:opacity-80 text-sm  border-black",
            {
              "w-10 h-10": !newVersion,
            },
          )}
        >
          <svg
            width="18"
            height="20"
            viewBox="0 0 18 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.15841 11.2584L11.8501 14.5751M11.8417 5.42509L6.15841 8.74176M16.5 4.16675C16.5 5.54746 15.3807 6.66675 14 6.66675C12.6193 6.66675 11.5 5.54746 11.5 4.16675C11.5 2.78604 12.6193 1.66675 14 1.66675C15.3807 1.66675 16.5 2.78604 16.5 4.16675ZM6.5 10.0001C6.5 11.3808 5.38071 12.5001 4 12.5001C2.61929 12.5001 1.5 11.3808 1.5 10.0001C1.5 8.61937 2.61929 7.50008 4 7.50008C5.38071 7.50008 6.5 8.61937 6.5 10.0001ZM16.5 15.8334C16.5 17.2141 15.3807 18.3334 14 18.3334C12.6193 18.3334 11.5 17.2141 11.5 15.8334C11.5 14.4527 12.6193 13.3334 14 13.3334C15.3807 13.3334 16.5 14.4527 16.5 15.8334Z"
              stroke="#18181B"
              stroke-width="1.67"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Button>

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
