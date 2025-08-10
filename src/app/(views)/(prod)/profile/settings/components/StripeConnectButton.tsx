import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SUPPORTED_COUNTRIES } from "@/constantes/stripeSupportedCountry";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useProfileStore } from "@/store/useProfileStore";
import { StripeOnboardingResponse } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useEffect, useState } from "react";

export default function StripeConnectButton() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const { userInfo } = useProfileStore();
  const { token } = useSession();

  const primaryStripeAccount = userInfo?.stripeAccounts?.[0] ?? null;
  useEffect(() => {
    primaryStripeAccount?.country &&
      setSelectedCountry(primaryStripeAccount.country);
  }, [userInfo]);
  const handleConnectStripe = async () => {
    if (!selectedCountry) return alert("Please select your country first");
    setLoading(true);

    try {
      const res = await fetchData<StripeOnboardingResponse>(
        "/stripe/me/stripe-account",
        HttpMethod.POST,
        { country: selectedCountry },
        token,
      );
      const data = res.data;

      if (data) {
        useProfileStore.setState((state) => {
          if (!state.userInfo) return state;
          return {
            userInfo: { ...state.userInfo, stripeAccounts: [data] },
          };
        });

        if (data.onboardingUrl) {
          window.location.assign(data.onboardingUrl);
        }
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Stripe onboarding error:", err);
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    setIsDeleting(true);

    if (!token) {
      console.error("No token found, aborting delete.");
      return;
    }
    console.log("Deleting Stripe account with token:", token);

    try {
      await fetchData(
        `/stripe/me/stripe-account/${accountId}`,
        HttpMethod.DELETE,
        null,
        token,
      );

      useProfileStore.setState((state) => {
        if (!state.userInfo) return state;
        return {
          userInfo: {
            ...state.userInfo,
            stripeAccounts: [],
          },
        };
      });
      setSelectedCountry("");
      toast({
        title: "Success",
        description: "Stripe account deleted successfully.",
        variant: "eventoSuccess",
      });
    } catch (err) {
      console.error("Error deleting Stripe account:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {primaryStripeAccount ? (
        <div className="flex gap-2">
          {primaryStripeAccount.detailsSubmitted &&
          primaryStripeAccount.chargesEnabled ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={"ghost"} asChild>
                  <span>✅ Connected</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-sm text-muted-foreground max-w-xs">
                <div className="flex flex-col gap-1">
                  <div>
                    <strong>Country:</strong>{" "}
                    {primaryStripeAccount.country ?? "N/A"}
                  </div>
                  <div>
                    <strong>Payouts:</strong>{" "}
                    {primaryStripeAccount.payoutsEnabled
                      ? "✅ Enabled"
                      : "❌ Disabled"}
                  </div>
                  <div>
                    <strong>Last sync:</strong>{" "}
                    {primaryStripeAccount.lastSync
                      ? new Date(primaryStripeAccount.lastSync).toLocaleString()
                      : "N/A"}
                  </div>
                  <div>
                    <strong>Account ID:</strong>{" "}
                    <code className="text-xs">
                      {primaryStripeAccount.accountId}
                    </code>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="eventoPrimary" onClick={handleConnectStripe}>
                  Continue Onboarding
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-sm text-muted-foreground max-w-xs">
                <div className="flex flex-col gap-1">
                  <p>
                    {primaryStripeAccount.detailsSubmitted
                      ? "Stripe account created, but still incomplete."
                      : "Onboarding not yet started or abandoned."}
                  </p>
                  <p>
                    {primaryStripeAccount.payoutsEnabled
                      ? "✅ Payouts enabled"
                      : "❌ Payouts not enabled"}
                  </p>
                  <p>
                    {primaryStripeAccount.chargesEnabled
                      ? "✅ Payments enabled"
                      : "❌ Payments not enabled"}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          )}

          <>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={loading}
            >
              Delete
            </Button>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogContent className="w-[90%] max-w-xl rounded">
                <DialogHeader>
                  <DialogTitle>Delete Stripe Account</DialogTitle>
                </DialogHeader>
                <p className="text-muted-foreground">
                  Are you sure you want to delete your Stripe account? You’ll
                  need to start onboarding again to reconnect.
                </p>
                <DialogFooter className="flex justify-end gap-4 mt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowDeleteDialog(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      handleDeleteAccount(
                        primaryStripeAccount.accountId as string,
                      )
                    }
                  >
                    {isDeleting ? "Deleting..." : "Confirm"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 justify-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Select
                  value={selectedCountry}
                  onValueChange={setSelectedCountry}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent className="h-52">
                    {SUPPORTED_COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-sm text-muted-foreground">
              <p>
                Select the country where <b>your bank account</b> is registered.
                Your Stripe Connect account must match the country of your
                payout bank.
              </p>
            </TooltipContent>
          </Tooltip>

          <Button
            onClick={handleConnectStripe}
            disabled={loading || !selectedCountry}
          >
            {loading ? "Connecting..." : "Connect Stripe"}
          </Button>
        </div>
      )}
    </div>
  );
}
