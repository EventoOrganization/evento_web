import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SmartGooglePlacesInput from "@/features/discover/SmartGooglePlacesInput";
import { cn } from "@/lib/utils";
import { InterestType } from "@/types/EventType";
import { format, startOfDay } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  CalendarIcon,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  XIcon,
} from "lucide-react";
import { useState } from "react";
type Props = {
  className?: string;
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  searchText: string;
  setSearchText: (text: string) => void;
  location: { lat: number; lng: number };
  setLocation: (location: { lat: number; lng: number }) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  interests: InterestType[];
  selectedInterests: InterestType[];
  setSelectedInterests: React.Dispatch<React.SetStateAction<InterestType[]>>;
};

const EventsFilters = ({
  className,
  showFilters,
  setShowFilters,
  searchText,
  setSearchText,
  location,
  setLocation,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  interests,
  selectedInterests,
  setSelectedInterests,
}: Props) => {
  const today = startOfDay(new Date());
  const [showReset, setShowReset] = useState(false);
  const resetDate = () => {
    setStartDate(null);
    setEndDate(null);
    setShowReset(false);
  };
  const handleStartDateChange = (date: Date | undefined) => {
    if (date && date >= today) {
      setStartDate(date);
      if (!endDate || date > endDate) {
        setEndDate(date);
      }
    }
    setShowReset(true);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!startDate) {
      setStartDate(today);
    }
    setEndDate(date || null);
    setShowReset(true);
  };

  return (
    <div className={cn(className)}>
      <h2
        className="hidden cursor-pointer text-sm px-1 md:px-4 py-3 transition-all duration-300 ease-in-out rounded text-center gap-2 bg-gray-200 md:flex justify-center items-center"
        onClick={() => setShowFilters((v) => !v)}
      >
        Filters{" "}
        {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </h2>
      <div
        className={cn(
          "text-xs flex-col transition-all duration-300 bg-muted top-0 z-20 space-y-2",
          {
            "translate-x-[-100%] md:translate-x-0 h-0 opacity-0 pointer-events-none":
              !showFilters,
            "translate-x-0 border-b-2 opacity-100 z-20 top-0 pt-5 overflow-y-auto pb-2":
              showFilters,
          },
        )}
      >
        <Button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden absolute bottom-4 right-4 p-2 bg-eventoPurpleDark"
        >
          <XIcon className=" w-6 h-6" />
        </Button>
        <div className="relative flex items-center px-2">
          <Search
            className="w-4 h-4 absolute left-3 md:left-6 text-muted-foreground"
            strokeWidth={2}
          />
          <Input
            type="text"
            placeholder="Search for events or users ..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10 border-none py-2 rounded-lg w-full text-xs md:text-sm"
          />
        </div>
        <div className="flex flex-col gap-2 px-2 py-0 pt-0 rounded bg-muted">
          <SmartGooglePlacesInput
            location={location || { lat: 0, lng: 0 }}
            setLocation={setLocation}
          />
        </div>
        <div className=" px-2 gap-4 ">
          <div className="flex justify-between items-center ">
            {showReset && (
              <button onClick={resetDate} className=" text-sm hover:underline">
                Reset
              </button>
            )}
          </div>
          <div className="relative grid grid-cols-2 gap-2">
            <Label htmlFor="start-date-filter">Start Date</Label>
            <Label htmlFor="end-date-filter">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="start-date-filter"
                  variant="outline"
                  className=" text-muted-foreground w-full justify-start text-left text-xs md:text-sm"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "dd/MM/yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate || today}
                  onSelect={handleStartDateChange}
                  initialFocus
                  fromDate={today}
                  locale={enUS}
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="end-date-filter"
                  variant="outline"
                  className="text-muted-foreground w-full justify-start text-left text-xs md:text-sm"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? (
                    format(endDate, "dd/MM/yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate || today}
                  onSelect={handleEndDateChange}
                  initialFocus
                  fromDate={startDate || today}
                  locale={enUS}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="px-2">
          <Label htmlFor="interests-category">Interests category</Label>
          <ul id="interests-category" className="flex flex-wrap gap-4 mt-4">
            {interests.map((interest) => {
              const isSelected = selectedInterests.some(
                (i) => i._id === interest._id,
              );

              return (
                <li
                  key={interest._id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedInterests(
                        (selectedInterests: InterestType[]) =>
                          selectedInterests.filter(
                            (i) => i._id !== interest._id,
                          ),
                      );
                    } else {
                      const updatedInterests = [...selectedInterests, interest];
                      setSelectedInterests(updatedInterests);
                    }
                  }}
                  className={`cursor-pointer px-2 py-2 md:text-sm rounded-md border w-fit flex items-center justify-center ${
                    isSelected
                      ? "bg-black text-white"
                      : "bg-gray-200 text-muted-foreground hover:bg-gray-300"
                  }`}
                >
                  {isSelected && <Check className="mr-2 w-4 h-4" />}
                  {interest.name}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EventsFilters;
