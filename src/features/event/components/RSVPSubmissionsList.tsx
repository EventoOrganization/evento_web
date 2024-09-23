import { cn } from "@/lib/utils";
import { UserType } from "@/types/UserType";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

const RSVPSubmissionsList = ({
  title,
  attendees,
}: {
  title: string;
  attendees: (UserType | null)[];
}) => {
  const [isOpen, setIsOpen] = useState(
    title === "RSVP Submissions" ? true : false,
  );

  return (
    <div className="mb-4 w-full ease-in-out">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center text-eventoPurpleLight font-bold p-2 rounded-md w-fit"
      >
        {title} ({attendees.filter((attendee) => attendee !== null).length})
        <span>
          <ChevronDownIcon
            className={cn(
              "transition-transform duration-300",
              isOpen ? "rotate-180" : "rotate-0",
            )}
          />
        </span>
      </button>

      {isOpen && (
        <div className="mt-2 space-y-4">
          {attendees
            .filter((attendee) => attendee !== null) // Filter out null attendees
            .map((attendee) => (
              <div key={attendee!._id} className="p-4 border rounded-md">
                <div className="flex items-center mb-4">
                  <img
                    src={attendee!.profileImage}
                    alt={attendee!.username}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <h3 className="font-bold">{attendee!.username}</h3>
                </div>

                {attendee!.rsvpSubmission ? (
                  attendee!.rsvpSubmission.rsvpAnswers.map((answer, index) => (
                    <div key={index} className="mb-2">
                      <p className="font-medium">Question {index + 1}:</p>
                      <p className="ml-4 text-gray-700">
                        {answer.answer.length > 0
                          ? answer.answer.join(", ")
                          : "No answer provided"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-700">No RSVP submission available</p>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default RSVPSubmissionsList;
