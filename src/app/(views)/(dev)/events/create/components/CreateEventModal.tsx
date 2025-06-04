import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import CreateEventPreview from "./CreateEventPreview";

type CreateEventModalProps = {
  formValues: any;
  mediaFiles: File[];
  user?: UserType | null;
  formRef?: React.RefObject<HTMLFormElement>;
  selectedInterests: InterestType[];
  setSelectedInterests: React.Dispatch<React.SetStateAction<InterestType[]>>;
  handleValueChange: (field: string, value: any) => void;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (e: React.FormEvent) => void;
};

const CreateEventModal = ({
  formValues,
  mediaFiles,
  user,
  formRef,
  selectedInterests,
  setSelectedInterests,
  handleValueChange,
  isOpen,
  onClose,
  onSuccess,
}: CreateEventModalProps) => {
  if (!formValues) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader className="sr-only">
        <DialogTitle className="sr-only">
          {formValues.title ? formValues.title : "Preview"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {formValues.description ? formValues.description : ""}
        </DialogDescription>
      </DialogHeader>
      <DialogContent className="bg-background p-0 py-0 w-full h-full">
        <ScrollArea className="rounded h-full">
          <h1 className="animate-slideInLeft opacity-0 lg:text-5xl flex justify-center md:justify-start md:font-bold text-black w-full mt-10 px-4">
            Preview
          </h1>
          <CreateEventPreview
            user={user}
            title={formValues.title}
            username={user?.username || formValues.username}
            profileImage={user?.profileImage}
            interests={selectedInterests}
            date={formValues.date}
            endDate={formValues.endDate}
            startTime={formValues.startTime}
            endTime={formValues.endTime}
            location={formValues.location}
            description={formValues.description}
            UrlTitle={formValues.UrlTitle}
            UrlLink={formValues.UrlLink}
            mediaFiles={mediaFiles}
            handleRemoveInterest={(interestId: string) => {
              setSelectedInterests((prev) =>
                prev.filter((i) => i._id !== interestId),
              );
              handleValueChange(
                "interests",
                selectedInterests.filter((i) => i._id !== interestId),
              );
            }}
          />
        </ScrollArea>
        <div className="grid grid-cols-2 gap-4 items-end p-4 bg-background">
          <Button
            variant="ghost"
            className="hover:bg-gray-200"
            onClick={onClose}
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={() => {
              onClose();
              formRef?.current?.requestSubmit();
            }}
            className="bg-evento-gradient  transition-transform duration-1000"
          >
            Create Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;
