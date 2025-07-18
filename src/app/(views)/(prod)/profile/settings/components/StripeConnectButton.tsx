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

  const stripeAccounts = userInfo?.stripeAccounts ?? [];

  const handleConnectStripe = async () => {
    if (!selectedCountry) return alert("Please select a country first");
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
        // On merge ou ajoute
        useProfileStore.setState((state) => {
          if (!state.userInfo) return state;

          const updated = state.userInfo.stripeAccounts?.some(
            (acc) => acc.country === data.country,
          )
            ? state.userInfo.stripeAccounts!.map((acc) =>
                acc.country === data.country ? data : acc,
              )
            : [...(state.userInfo.stripeAccounts ?? []), data];

          return {
            userInfo: { ...state.userInfo, stripeAccounts: updated },
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
    if (!confirm("Are you sure you want to delete this Stripe account?"))
      return;

    try {
      await fetchData(
        `/stripe/me/stripe-account/${accountId}`,
        HttpMethod.DELETE,
        null,
        token,
      );

      // ✅ Remove locally from store
      useProfileStore.setState((state) => {
        if (!state.userInfo) return state;
        return {
          userInfo: {
            ...state.userInfo,
            stripeAccounts: state.userInfo.stripeAccounts?.filter(
              (acc) => acc.accountId !== accountId,
            ),
          },
        };
      });
    } catch (err) {
      console.error("Error deleting Stripe account:", err);
    }
  };

  return (
    <div className="space-y-4">
      {/* ✅ Liste des comptes existants */}
      {stripeAccounts.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Existing Stripe Accounts</h3>
          {stripeAccounts.map((acc) => (
            <div
              key={acc.accountId}
              className="flex justify-between items-center p-2 border rounded-md"
            >
              <div>
                <p className="font-semibold">{acc.country}</p>
                {acc.detailsSubmitted && acc.chargesEnabled ? (
                  <span className="text-green-600 text-sm">✅ Connected</span>
                ) : (
                  <span className="text-yellow-600 text-sm">
                    ⏳ Onboarding not completed
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                {!acc.detailsSubmitted && (
                  <Button
                    variant="eventoPrimary"
                    onClick={() => {
                      // Continue onboarding for this account
                      setSelectedCountry(acc.country!);
                      handleConnectStripe();
                    }}
                  >
                    Continue Onboarding
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteAccount(acc.accountId!)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Sélecteur pour ajouter un nouveau pays */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 justify-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Select
                value={selectedCountry}
                onValueChange={setSelectedCountry}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select new country" />
                </SelectTrigger>
                <SelectContent className="h-52">
                  {SUPPORTED_COUNTRIES.map((c) => {
                    const alreadyAdded = stripeAccounts.some(
                      (acc) => acc.country === c.code,
                    );
                    return (
                      <SelectItem
                        key={c.code}
                        value={c.code}
                        disabled={alreadyAdded}
                      >
                        {c.name} {alreadyAdded && "✅"}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-sm text-muted-foreground">
            <p>
              Select the country where <b>your bank account</b> is registered.
              Your Stripe Connect account must match the country of your payout
              bank.
            </p>
          </TooltipContent>
        </Tooltip>

        <Button
          onClick={handleConnectStripe}
          disabled={loading || !selectedCountry}
        >
          {loading ? "Connecting..." : "Connect New Country"}
        </Button>
      </div>
    </div>
  );
}
