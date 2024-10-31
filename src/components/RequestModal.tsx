// RequestModal.tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RequestModalProps {
  isOpen: boolean;
  onRequestToJoin: () => void;
  onAuthModalOpen: () => void;
  hasToken: boolean;
}

const RequestModal: React.FC<RequestModalProps> = ({
  isOpen,
  onRequestToJoin,
  onAuthModalOpen,
  hasToken,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed z-20 top-0 left-0 w-screen h-screen backdrop-blur transition-opacity duration-300 flex items-center justify-center bg-black/50",
      )}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md md:mx-auto mx-4">
        <h2 className="text-2xl font-semibold mb-4">Private Event</h2>
        <p className="mb-6 text-gray-600">
          This is a private event, and access is currently restricted. To
          request an invitation, click the button below.
        </p>
        <Button
          onClick={() => {
            if (hasToken) {
              onRequestToJoin();
            } else {
              onAuthModalOpen();
            }
          }}
          className="bg-evento-gradient text-white w-full"
        >
          Request to Join
        </Button>
      </div>
    </div>
  );
};

export default RequestModal;
