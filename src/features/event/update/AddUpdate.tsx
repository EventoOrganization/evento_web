import EventoSpinner from "@/components/EventoSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/contexts/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { EventType } from "@/types/EventType";
import { TempUserType, UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { BellIcon, XIcon } from "lucide-react";
import { useState } from "react";

type AddAnnouncementProps = {
  event: EventType | undefined;
  invitedUsers: (UserType | TempUserType)[];
  setIsSelectEnable: (isEnabled: boolean) => void;
  setEvent?: (event: EventType) => void;
  selectedIds?: string[];
};
type DisplayType = "radio" | "checkbox" | "";
type QuestionType = "text" | "multiple-choice" | "";

type Question = {
  question: string;
  type: QuestionType;
  displayType: DisplayType;
  options: string[];
};

const AddAnnouncement = ({
  event,
  invitedUsers,
  setIsSelectEnable,
  selectedIds,
  setEvent,
}: AddAnnouncementProps) => {
  const { toast } = useToast();
  const { token, user } = useSession();
  const [isNotifying, setIsNotifying] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [announcementType, setAnnouncementType] = useState<
    "info" | "questionnaire"
  >("info");
  const [questions, setQuestions] = useState<Question[]>([
    {
      question: "",
      type: "",
      displayType: "",
      options: [],
    },
  ]);

  const getPlaceholder = (value: string) => {
    switch (value) {
      case "going":
        return announcementType === "info"
          ? "Notify all attendees now!"
          : "Notify all attendees to complete the questionnaire!";
      case "invited":
        return announcementType === "info"
          ? "Notify all invited guests now!"
          : "Notify all invited guests to complete the questionnaire!";
      case "decline":
        return announcementType === "info"
          ? "Notify all declined guests now!"
          : "Notify all declined guests to complete the questionnaire!";
      case "individuals":
        return announcementType === "info"
          ? "Notify Selected people now!"
          : "Notify Selected people to complete the questionnaire!";
      default:
        return "";
    }
  };

  const handleAnnouncement = async () => {
    if (!message.trim()) {
      switch (announcementType) {
        case "info":
          toast({
            title: "Error",
            description: "Message cannot be empty",
            variant: "destructive",
          });
          break;
        case "questionnaire":
          setMessage("Hello, please complete the questionnaire!");
          break;
      }
      return;
    }

    setIsLoading(true);
    try {
      const receivers =
        isNotifying === "individuals"
          ? { userIds: selectedIds || [] }
          : { status: isNotifying };

      const response = await fetchData<any>(
        `/events/${event?._id}/createAnnouncement`,
        HttpMethod.POST,
        {
          userId: user?._id,
          message,
          receivers,
          type: announcementType,
          questions: announcementType === "questionnaire" ? questions : [],
        },
        token,
      );

      if (!response.ok) {
        throw new Error("Failed to send announcement");
      }

      toast({
        title: "Success",
        description: "Announcement sent successfully!",
        className: "bg-evento-gradient text-white",
      });

      // Reset state
      setIsNotifying("");
      setMessage("");
      setIsSelectEnable(false);
      console.log("response", response?.data?.announcement);
      if (event && setEvent) {
        setEvent({
          ...event,
          announcements: [
            ...(event.announcements ?? []),
            response.data.announcement,
          ],
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Label htmlFor="notify" className="text-eventoPurpleLight">
        <BellIcon className="inline h-4 w-4 " /> Notify Guests
      </Label>
      <Select
        disabled={isLoading}
        value={isNotifying}
        onValueChange={(value) => {
          setIsNotifying(value);
          setIsSelectEnable(value === "individuals");
        }}
      >
        <SelectTrigger id="notify">
          <SelectValue placeholder="Select who is notified" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="going">
            Going ({event?.attendees?.length})
          </SelectItem>
          <SelectItem value="invited">
            Invited ({invitedUsers?.length})
          </SelectItem>
          {event?.eventType === "private" && (
            <SelectItem value="decline">
              Decline ({event?.refused?.length})
            </SelectItem>
          )}
          <SelectItem value="individuals">
            Select Individuals{" "}
            {(selectedIds?.length ?? 0 > 0) ? `(${selectedIds?.length})` : ""}
          </SelectItem>
        </SelectContent>
      </Select>
      {isNotifying && (
        <>
          {/* <Label className="text-eventoPurpleLight">Announcement Type</Label> */}
          <Select
            value={announcementType}
            onValueChange={(value) =>
              setAnnouncementType(value as "info" | "questionnaire")
            }
          >
            <SelectTrigger className="col-span-2">
              <SelectValue placeholder="Select announcement type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="info">Simple Announcement</SelectItem>
              <SelectItem value="questionnaire">Questionnaire</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            placeholder={getPlaceholder(isNotifying)}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
            className="col-span-2"
          />
          {announcementType === "questionnaire" && (
            <div className="flex flex-col gap-4 col-span-2">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className="border p-2 space-y-2 rounded-md bg-card"
                >
                  <h3 className="text-lg font-semibold">Question {idx + 1}</h3>
                  <Select
                    value={
                      q.type === "multiple-choice"
                        ? q.displayType
                        : q.type || ""
                    }
                    onValueChange={(val: "text" | "radio" | "checkbox") => {
                      const updated = [...questions];
                      if (val === "text") {
                        updated[idx].type = "text";
                        updated[idx].displayType = "";
                        updated[idx].options = [];
                      } else {
                        updated[idx].type = "multiple-choice";
                        updated[idx].displayType = val as "radio" | "checkbox";
                        if (!updated[idx].options) {
                          updated[idx].options = [""];
                        }
                      }
                      setQuestions(updated);
                    }}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select answer type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text (Free answer)</SelectItem>
                      <SelectItem value="checkbox">
                        Multiple choices (checkbox)
                      </SelectItem>
                      <SelectItem value="radio">
                        Single choice (radio)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Question text"
                    value={q.question}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[idx].question = e.target.value;
                      setQuestions(updated);
                    }}
                  />
                  {q.displayType === "checkbox" && (
                    <div className="flex flex-col gap-2 mt-2">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <Input
                            value={opt}
                            onChange={(e) => {
                              const updated = [...questions];
                              updated[idx].options[oIdx] = e.target.value;
                              setQuestions(updated);
                            }}
                            placeholder={`Option ${oIdx + 1}`}
                          />
                        </div>
                      ))}
                      <Button
                        variant="secondary"
                        onClick={() => {
                          const updated = [...questions];
                          updated[idx].options.push("");
                          setQuestions(updated);
                        }}
                      >
                        + Add Option
                      </Button>
                    </div>
                  )}
                  {q.type === "multiple-choice" &&
                    q.displayType === "radio" && (
                      <RadioGroup
                        value={""} // ici on ne sélectionne rien, juste pour afficher les options
                        className="flex flex-col gap-2 mt-2"
                      >
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2">
                            <Input
                              value={opt}
                              onChange={(e) => {
                                const updated = [...questions];
                                updated[idx].options[oIdx] = e.target.value;
                                setQuestions(updated);
                              }}
                              placeholder={`Option ${oIdx + 1}`}
                              className="w-full"
                            />
                          </div>
                        ))}

                        <Button
                          variant="secondary"
                          onClick={() => {
                            const updated = [...questions];
                            updated[idx].options.push("");
                            setQuestions(updated);
                          }}
                        >
                          + Add Option
                        </Button>
                      </RadioGroup>
                    )}
                </div>
              ))}

              <Button
                variant="outline"
                onClick={() =>
                  setQuestions([
                    ...questions,
                    {
                      question: "",
                      type: "text",
                      displayType: "",
                      options: [],
                    },
                  ])
                }
              >
                + Add Question
              </Button>
            </div>
          )}

          <div className="col-span-2 flex flex-col gap-2">
            <div className="flex w-fit gap-2 self-end">
              <Button
                disabled={isLoading}
                onClick={() => {
                  setIsNotifying("");
                  setMessage("");
                  setIsSelectEnable(false);
                }}
                variant={"eventoSecondary"}
              >
                <XIcon size={16} />
                Cancel
              </Button>
              <Button
                variant={"eventoPrimary"}
                onClick={handleAnnouncement}
                disabled={isLoading}
              >
                {isLoading ? <EventoSpinner /> : "Send Announcement"}
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AddAnnouncement;
