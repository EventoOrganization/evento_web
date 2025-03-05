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
      transformHeader: (header) => header.toLowerCase().trim(), // Normalise les en-têtes
      complete: (results) => {
        const data = results.data as TempUserType[];

        // Vérification si les colonnes sont bien présentes
        if (
          !results.meta.fields?.includes("email") ||
          !results.meta.fields?.includes("username")
        ) {
          setError("CSV file must have 'email' and 'username' columns.");
          return;
        }

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
          <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded p-3 shadow-lg border border-gray-600 z-50 max-w-xs sm:max-w-sm w-[90%] overflow-auto max-h-60">
            <p className="mb-2 text-sm font-semibold text-center">
              CSV format required:
            </p>
            <table className="w-full border-collapse border border-gray-500 text-center text-xs">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="border border-gray-500 px-2 py-1">email ✅</th>
                  <th className="border border-gray-500 px-2 py-1">
                    username ✅
                  </th>
                  <th className="border border-gray-500 px-2 py-1 text-gray-400">
                    useless_column ❌
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-500 px-2 py-1">
                    john@example.com
                  </td>
                  <td className="border border-gray-500 px-2 py-1">JohnDoe</td>
                  <td className="border border-gray-500 px-2 py-1 text-gray-400">
                    ignored_data
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-500 px-2 py-1">
                    jane@example.com
                  </td>
                  <td className="border border-gray-500 px-2 py-1">JaneDoe</td>
                  <td className="border border-gray-500 px-2 py-1 text-gray-400">
                    ignored_data
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2">
              ✅ Only &quot;email&quot; and &quot;username&quot; will be
              imported.
            </p>
            <p className="text-gray-300">
              ❌ Other columns (e.g., &quot;useless_column&quot;) will be
              ignored.
            </p>
            <p className="mt-1 font-semibold">
              ℹ️ The position of the columns does not matter.
            </p>
            <p className="mt-1">
              Make sure the first row contains the correct column names.
            </p>
          </div>
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
