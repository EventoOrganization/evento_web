"use client";

const RSVPSubmissionsList = ({ rsvp }: { rsvp: any[] }) => {
  const exportToCSV = () => {
    const headers = ["Username", "Profile Image", "Question", "Answer"];
    const rows: string[][] = [];

    rsvp.forEach((attendee) => {
      attendee.rsvpAnswers?.forEach((answer: any, index: number) => {
        rows.push([
          attendee.username || "Unknown",
          attendee.profileImage || "No Image",
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
    <button
      className="text-blue-500 py-2 px-4 rounded-md"
      onClick={exportToCSV}
    >
      Export RSVP
    </button>
  );
};

export default RSVPSubmissionsList;
