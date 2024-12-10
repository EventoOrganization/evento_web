import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TempUserType } from "@/types/UserType";
import { InfoIcon } from "lucide-react";
import Papa from "papaparse";
import { useState } from "react";

interface CSVImportProps {
  onAddTempGuests: (guests: TempUserType[]) => void;
}

const CSVImport = ({ onAddTempGuests }: CSVImportProps) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCsvFile(e.target.files?.[0] || null);
  };

  const handleImportCSV = () => {
    if (!csvFile) {
      setError("Please select a CSV file.");
      return;
    }

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<TempUserType>) => {
        const data = results.data as TempUserType[];

        // Validate the data to ensure it has the correct fields
        const validGuests = data.filter(
          (guest) => guest.email && guest.username,
        );

        if (validGuests.length > 0) {
          onAddTempGuests(validGuests);
          setError("");
        } else {
          setError("No valid guests found in the CSV file.");
        }
      },
      error: (err: Error) => {
        setError("Error reading CSV file");
        console.error(err);
      },
    });
  };

  return (
    <>
      <h4 className="flex gap-2 pt-4 pb-2 w-full">
        Import in bulk!{" "}
        <InfoIcon
          className="w-4 text-gray-500 cursor-pointer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        />
        {showTooltip && (
          <span className="absolute bg-gray-800 text-white text-xs rounded py-1 px-2 -mt-10 ml-4">
            Format: email, username
          </span>
        )}
      </h4>
      <div className="flex gap-2 w-full">
        <Input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className=""
        />
        <Button
          type="button"
          onClick={handleImportCSV}
          className="bg-evento-gradient-button hover:bg-evento-gradient-button/80 border shadow"
        >
          Import CSV
        </Button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
};

export default CSVImport;
