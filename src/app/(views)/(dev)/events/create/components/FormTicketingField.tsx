"use client";

import StripeConnectButton from "@/app/(views)/(prod)/profile/settings/components/StripeConnectButton";
import AuthModal from "@/components/system/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/togglerbtn";
import { SUPPORTED_COUNTRIES } from "@/constantes/stripeSupportedCountry";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useProfileStore } from "@/store/useProfileStore";
import { useState } from "react";

type Props = {
  ticketing: {
    enabled: boolean;
    totalTickets: number;
    price: number;
    currency: string;
  };
  onChange: (field: string, value: any) => void;
};

export default function FormTicketingField({ ticketing, onChange }: Props) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const { userInfo } = useProfileStore();
  const { isAuthenticated } = useSession();
  // ✅ Détection Stripe account
  const stripeAccount = userInfo?.stripeAccounts?.[0];
  const hasStripeAccount = Boolean(stripeAccount?.chargesEnabled);
  const payoutStripeAccountId = stripeAccount?.accountId;

  // ✅ Pays + devise payout obligatoire Stripe
  const userCountry = stripeAccount?.country ?? "FR"; // fallback FR
  const payoutCurrency =
    SUPPORTED_COUNTRIES.find((c) => c.code === userCountry)?.currency ?? "eur";

  // ✅ Bloquer la devise et la forcer si besoin
  if (ticketing.currency !== payoutCurrency) {
    onChange("ticketing", {
      ...ticketing,
      currency: payoutCurrency,
    });
  }

  const isChecked = ticketing.enabled;

  return (
    <div className="space-y-3 border-t pt-3">
      {/* Toggle Ticketing */}
      <div className="flex items-center gap-2">
        <Switch
          checked={isChecked}
          onCheckedChange={(checked) =>
            onChange("ticketing", {
              ...ticketing,
              enabled: checked,
              currency: payoutCurrency,
              payoutStripeAccountId: payoutStripeAccountId,
            })
          }
        />
        <Label>Enable Ticketing</Label>
      </div>
      {/* ✅ Si pas de Stripe account ET toggle activé → avertissement + bouton connect */}
      {!hasStripeAccount && isChecked && isAuthenticated && (
        <div className="mt-2 space-y-2">
          <p className="text-red-500 text-sm">
            You must connect a Stripe account to enable ticketing.
          </p>
          <StripeConnectButton />
        </div>
      )}
      {isChecked && !isAuthenticated && (
        <>
          <p className="text-red-500 text-sm">
            You must connect a Stripe account to enable ticketing.
          </p>
          <Button
            onClick={() => setIsAuthModalOpen(true)}
            variant={"eventoPrimary"}
            className="w-full"
          >
            Sign-up
          </Button>
        </>
      )}
      {/* ✅ Si ticketing activé ET compte Stripe valide → affiche les champs */}
      {ticketing.enabled && hasStripeAccount && (
        <div className="space-y-4">
          {/* Total tickets */}
          <div>
            <Label>Total tickets available</Label>
            <Input
              type="number"
              min={1}
              value={ticketing.totalTickets}
              onChange={(e) =>
                onChange("ticketing", {
                  ...ticketing,
                  totalTickets: parseInt(e.target.value || "0"),
                })
              }
            />
          </div>

          {/* Prix + devise Stripe imposée */}
          <div>
            <Label>
              Ticket price{" "}
              <span className="text-gray-500">
                (currency: {payoutCurrency.toUpperCase()} fixed by Stripe)
              </span>
            </Label>
            <Input
              type="number"
              min={0}
              step={0.01}
              value={ticketing.price / 100}
              onChange={(e) =>
                onChange("ticketing", {
                  ...ticketing,
                  price: Math.round(parseFloat(e.target.value || "0") * 100),
                  currency: payoutCurrency, // toujours la bonne devise
                })
              }
            />
          </div>
        </div>
      )}{" "}
      {isAuthModalOpen && (
        <AuthModal
          onAuthSuccess={() => setIsAuthModalOpen(false)}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </div>
  );
}
