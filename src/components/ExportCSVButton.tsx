import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";

const handleExportCSV = (event: any) => {
  const goingUsers = event.attendees.filter(
    (attendee: any) => attendee.rsvpAnswers && attendee.rsvpAnswers.length > 0,
  );

  // En-têtes du CSV
  const headers = ["Username", "Email", "Question", "Answer"];

  // Contenu du CSV
  const rows = goingUsers.flatMap((attendee: any) =>
    attendee.rsvpAnswers.map((answer: any) => {
      const question =
        event.questions.find((q: any) => q._id === answer.questionId)
          ?.question || "Unknown Question";
      return [
        attendee.username,
        attendee.email,
        question,
        answer.answer.join(", "),
      ];
    }),
  );

  // Créer le contenu du CSV
  const csvContent = [
    headers.join(","), // En-têtes
    ...rows.map((row: string[]) =>
      row.map((field: string) => `"${field}"`).join(","),
    ), // Lignes de données
  ].join("\n");

  // Télécharger le fichier
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `${event.title.replace(/\s+/g, "_")}_responses.csv`);
};

const ExportCSVButton = ({ event }: { event: any }) => {
  return (
    <Button variant={"link"} onClick={() => handleExportCSV(event)}>
      Export CSV
    </Button>
  );
};

export default ExportCSVButton;
