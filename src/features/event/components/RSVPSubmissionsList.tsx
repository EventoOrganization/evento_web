"use client";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const RSVPSubmissionsList = ({
  title,
  rsvp,
}: {
  title: string;
  rsvp: any[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const exportToCSV = () => {
    const headers = ["Username", "Profile Image", "Question", "Answer"];
    const rows: string[][] = [];

    rsvp.forEach((attendee) => {
      attendee.rsvpAnswers.forEach((answer: any, index: number) => {
        rows.push([
          attendee.userId.username,
          attendee.userId.profileImage,
          `Q${index + 1}`,
          answer.answer.join(", "),
        ]);
      });
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "rsvp_responses.csv");
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link); // Clean up the link element
  };

  return (
    <div className="mb-4 w-full ease-in-out">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center text-eventoPurpleLight font-bold p-2 rounded-md w-fit"
      >
        {title} ({rsvp.length})
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
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
            onClick={exportToCSV}
          >
            Export to CSV
          </button>

          {rsvp.map((attendee) => (
            <div key={attendee._id} className="p-4 border rounded-md">
              <div className="flex items-center mb-4">
                <Image
                  src={attendee.userId.profileImage || ""}
                  alt={attendee.userId.username}
                  width={30}
                  height={30}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <h3 className="font-bold">{attendee.userId.username}</h3>
              </div>

              {attendee.rsvpAnswers.length > 0 ? (
                <div className="text-gray-700">
                  <p className="font-medium mb-2">RSVP Answers:</p>
                  <ul className="list-disc list-inside ml-4">
                    {attendee.rsvpAnswers.map((answer: any, index: number) => (
                      <li key={index}>
                        {`Q${index + 1}: ${answer.answer.join(", ")}`}
                      </li>
                    ))}
                  </ul>
                </div>
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
