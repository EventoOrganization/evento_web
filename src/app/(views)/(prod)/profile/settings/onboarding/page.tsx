"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useProfileStore } from "@/store/useProfileStore";
import { UserType } from "@/types/UserType";
import { HttpMethod, fetchData } from "@/utils/fetchData";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function StripeOnboardingStatusPage() {
  const router = useRouter();
  const { token } = useSession();
  const { userInfo, setProfileData } = useProfileStore();

  const [message, setMessage] = useState(
    "⏳ Checking your Stripe account status...",
  );
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const stripeAccount = userInfo?.stripeAccounts?.[0];

  const refreshProfile = async () => {
    if (!token) return;
    setIsFetching(true);
    const res = await fetchData(
      "/profile/getLoggedUserProfile",
      HttpMethod.GET,
      null,
      token,
    );
    if (res.ok) {
      const userData = res.data as UserType;
      setProfileData(userData);
    }
    setIsFetching(false);
  };

  useEffect(() => {
    if (
      !stripeAccount ||
      !stripeAccount.chargesEnabled ||
      !stripeAccount.detailsSubmitted
    ) {
      refreshProfile(); // première tentative

      const interval = setInterval(() => {
        refreshProfile();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [token, stripeAccount?.chargesEnabled, stripeAccount?.detailsSubmitted]);

  useEffect(() => {
    if (!stripeAccount) {
      setMessage("❌ No Stripe account found.");
      setLoading(false);
      return;
    }

    if (stripeAccount.chargesEnabled && stripeAccount.detailsSubmitted) {
      setMessage("✅ Your Stripe account is connected and ready.");
      setShowConfetti(true);
      setLoading(false);
    } else if (!stripeAccount.detailsSubmitted) {
      setMessage("⚠️ You haven't completed all the onboarding steps yet.");
      setLoading(false);
    } else {
      setMessage("⏳ Your Stripe account is being reviewed...");
      setLoading(false);
    }
  }, [stripeAccount]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center relative">
      {showConfetti && (
        <Confetti
          className="w-full h-screen"
          recycle={false}
          numberOfPieces={400}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      )}

      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        {message}
        {isFetching && (
          <Loader2 className="animate-spin w-5 h-5 text-muted-foreground" />
        )}
      </h1>

      {stripeAccount && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-sm text-muted-foreground cursor-default border p-3 rounded-lg bg-muted w-fit">
              🔍 View account details
            </div>
          </TooltipTrigger>
          <TooltipContent className="text-sm text-muted-foreground max-w-xs">
            <div className="flex flex-col gap-1">
              <div>
                <strong>Country:</strong> {stripeAccount.country ?? "N/A"}
              </div>
              <div>
                <strong>Payouts:</strong>{" "}
                {stripeAccount.payoutsEnabled ? "✅ Enabled" : "❌ Disabled"}
              </div>
              <div>
                <strong>Charges:</strong>{" "}
                {stripeAccount.chargesEnabled ? "✅ Enabled" : "❌ Disabled"}
              </div>
              <div>
                <strong>Details submitted:</strong>{" "}
                {stripeAccount.detailsSubmitted ? "✅ Yes" : "❌ No"}
              </div>
              <div>
                <strong>Last sync:</strong>{" "}
                {stripeAccount.lastSync
                  ? new Date(stripeAccount.lastSync).toLocaleString()
                  : "N/A"}
              </div>
              <div>
                <strong>Account ID:</strong>{" "}
                <code className="text-xs">{stripeAccount.accountId}</code>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      )}

      <Button
        className="mt-6"
        onClick={() => router.push("/profile/settings")}
        disabled={loading}
      >
        Back to settings
      </Button>
    </div>
  );
}
