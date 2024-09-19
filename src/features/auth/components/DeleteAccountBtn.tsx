"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DeleteAccountBtn = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const session = useSession();
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetchData(
        "/auth/delete-account",
        HttpMethod.DELETE,
        undefined,
        session.token,
      );
      if (response.ok) {
        toast({
          description: "Account deleted successfully",
          className: "bg-red-500 text-white",
        });
      } else {
        toast({
          description: response.error || "Failed to delete account",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        description: "An error occurred while deleting your account",
        variant: "destructive",
      });
    } finally {
      session.endSession();
      setIsDeleting(false);
      setShowConfirmation(false);
      router.push("/");
    }
  };

  return (
    <div>
      <Button onClick={() => setShowConfirmation(true)} disabled={isDeleting}>
        Delete Account
      </Button>

      {showConfirmation && (
        <div className="confirmation-dialog">
          <p>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </p>
          <div className="flex gap-4 mt-2">
            <Button onClick={handleDeleteAccount} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Confirm"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowConfirmation(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccountBtn;
