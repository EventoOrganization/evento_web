// ./components/CreateEventPreview.tsx
"use client";
import SmartImage from "@/components/SmartImage";
import TruncatedText from "@/components/TruncatedText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { InterestType, PresetMedia } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import CreateEventCarousel from "./CreateEventCarousel";

type PreviewProps = {
  user?: UserType | null;
  title: string;
  username?: string;
  profileImage?: string;
  interests: InterestType[];
  date: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  UrlTitle?: string;
  UrlLink?: string;
  toUploadFiles: File[];
  selectedPredefinedMedia: PresetMedia[];
  handleRemoveInterest?: (interestId: string) => void;
  className?: string;
  inModal?: boolean;
};

const CreateEventPreview = ({
  user,
  title,
  username,
  profileImage,
  interests,
  date,
  endDate,
  startTime,
  endTime,
  location,
  description,
  UrlTitle,
  UrlLink,
  toUploadFiles,
  selectedPredefinedMedia,
  handleRemoveInterest,
  className,
  inModal = false,
}: PreviewProps) => {
  const renderDate = () => {
    const startDate = date || new Date().toISOString();
    const formatDate = (
      dateString: string,
      includeYear = false,
      fullMonth = false,
    ) => {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        month: fullMonth ? "long" : "short",
        day: "numeric",
        ...(includeYear && { year: "numeric" }),
      };
      return date.toLocaleDateString("en-UK", options);
    };

    const formatMonthYear = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-UK", {
        month: "long",
        year: "numeric",
      });
    };

    const start = new Date(startDate);
    const end = new Date(endDate);

    const isSameDay = end.getTime() - start.getTime() < 24 * 60 * 60 * 1000;

    if (isSameDay) {
      return `${formatDate(startDate, true, true)}`;
    }

    if (
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
    ) {
      return `From ${start.getDate()} to ${end.getDate()} ${formatMonthYear(startDate)}`;
    }

    if (start.getFullYear() === end.getFullYear()) {
      return `From ${formatDate(startDate)} to ${formatDate(endDate, true)}`;
    }

    return `From ${formatDate(startDate, true)} to ${formatDate(endDate, true)}`;
  };

  return (
    <>
      <div
        className={cn(
          "bg-background md:border md:shadow rounded p-4 w-full grid grid-cols-1 h-fit gap-4 hover:shadow-xl hover:bg-slate-50 cursor-pointer relative",
          className,
          { "lg:grid-cols-2 items-start gap-10": inModal },
        )}
      >
        <div className="flex items-center justify-between ">
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2 items-center">
                {user && user?.profileImage ? (
                  <SmartImage
                    src={user?.profileImage || ""}
                    alt="user image"
                    width={30}
                    height={30}
                    className="w-8 h-8 rounded-full"
                    forceImg
                  />
                ) : (
                  <Avatar>
                    <AvatarImage
                      src={"/evento-logo.png"}
                      className="rounded-full w-8 h-8"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <h4 className="text-sm">{username}</h4>
                  <span className="text-xs text-muted-foreground">Host</span>
                </div>
              </div>
            </div>
            <CreateEventCarousel
              mediaFiles={toUploadFiles}
              presetMedia={selectedPredefinedMedia}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3>{title ? title : "Event Title"}</h3>
          <ul className="flex gap-2 flex-wrap ">
            {interests &&
              interests.map((interest: any, index: number) => (
                <li
                  key={index}
                  onClick={() =>
                    handleRemoveInterest && handleRemoveInterest(interest._id)
                  }
                  className="border  w-fit px-2 py-1 rounded-lg text-sm"
                >
                  {interest.name}
                </li>
              ))}
          </ul>
          <div className="flex gap-2 items-center">
            <span className="whitespace-nowrap text-eventoPurpleDark font-bold">
              {date ? renderDate() : "Date"}
            </span>
            <p className="text-sm text-muted-foreground">
              {startTime ? startTime : "08:00"}
              {`${endTime ? "- " + endTime : ""}`}
            </p>
          </div>
          <span
            className="truncate text-muted-foreground text-sm"
            onClick={() =>
              alert("In real event it will open google map with this location")
            }
          >
            {location}
          </span>

          {description && <Label htmlFor="description">Description</Label>}
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">
            {description}
          </p>

          <TruncatedText
            isLink
            url={UrlLink}
            className="text-eventoPink"
            text={UrlTitle || UrlLink || ""}
          />
        </div>
      </div>
    </>
  );
};

export default CreateEventPreview;
