import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useState } from "react";

export default function StripeConnectButton() {
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const { userInfo } = useProfileStore();
  const { token } = useSession();

  const primaryStripeAccount = userInfo?.stripeAccounts?.[0] ?? null;

  const handleConnectStripe = async () => {
    if (!selectedCountry) return alert("Please select your country first");
    setLoading(true);

    try {
      const res = await fetchData<StripeOnboardingResponse>(
        "/stripe/me/stripe-account",
        HttpMethod.POST,
        { country: selectedCountry }, // ✅ user choisit son pays
        token,
      );
      const data = res.data;

      if (data) {
        // ✅ Met à jour uniquement le premier compte
        useProfileStore.setState((state) => {
          if (!state.userInfo) return state;
          return {
            userInfo: { ...state.userInfo, stripeAccounts: [data] },
          };
        });

        if (data.onboardingUrl) {
          window.open(data.onboardingUrl, "_blank", "noopener,noreferrer");
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
    if (!confirm("Are you sure you want to delete your Stripe account?"))
      return;

    try {
      await fetchData(
        `/stripe/me/stripe-account/${accountId}`,
        HttpMethod.DELETE,
        null,
        token,
      );

      // ✅ Clear in store
      useProfileStore.setState((state) => {
        if (!state.userInfo) return state;
        return {
          userInfo: {
            ...state.userInfo,
            stripeAccounts: [],
          },
        };
      });
      setSelectedCountry(""); // reset du select
    } catch (err) {
      console.error("Error deleting Stripe account:", err);
    }
  };

  return (
    <div className="space-y-4">
      {primaryStripeAccount ? (
        // ✅ Un seul compte affiché
        <div className="flex gap-2">
          {!primaryStripeAccount.detailsSubmitted && (
            <Button variant="eventoPrimary" onClick={handleConnectStripe}>
              Continue Onboarding
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={() => handleDeleteAccount(primaryStripeAccount.accountId!)}
          >
            Delete
          </Button>
        </div>
      ) : (
        // ✅ Pas encore de compte → choix du pays + bouton
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
