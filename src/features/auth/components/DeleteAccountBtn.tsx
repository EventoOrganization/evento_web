"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
        session.endSession();
        localStorage.clear();
        sessionStorage.clear();
        router.push("/");
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
      setIsDeleting(false);
      setShowConfirmation(false);
    }
  };

  return (
    <div>
      <Button onClick={() => setShowConfirmation(true)} disabled={isDeleting}>
        Delete Account
      </Button>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-[90%] rounded">
          <DialogHeader>
            <DialogTitle>Confirm Account Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete your account? This action cannot be
            undone.
          </p>
          <DialogFooter className="flex justify-end gap-4 mt-4">
            <Button
              variant="ghost"
              onClick={() => setShowConfirmation(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteAccount} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteAccountBtn;
