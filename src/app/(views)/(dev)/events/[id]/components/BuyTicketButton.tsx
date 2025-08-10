"use client";

import AuthModal from "@/components/system/auth/AuthModal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useEventStore } from "@/store/useEventsStore";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useState } from "react";

type Props = {
  eventId: string;
};

export default function BuyTicketButton({ eventId }: Props) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const { user, isAuthenticated, token } = useSession();
  const { events } = useEventStore();
  const event = events.find((e) => e._id === eventId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const ticketsOwned =
    event?.soldTickets
      ?.filter((t) => t.buyerId === user?._id)
      ?.reduce((acc, t) => acc + (t.quantity || 0), 0) ?? 0;

  const alreadyBought = ticketsOwned > 0;

  const maxQuantity = event?.ticketing?.remainingTickets ?? 0;
  const canBuyMore = maxQuantity > 0;
  const handleBuy = async () => {
    if (maxQuantity < 1) return;

    setLoading(true);
    try {
      const res = await fetchData<{ sessionUrl: string }>(
        "/stripe/checkout/session",
        HttpMethod.POST,
        { eventId, quantity },
        token,
      );
      if (res.data?.sessionUrl) {
        window.location.href = res.data.sessionUrl;
      } else {
        throw new Error("No session URL returned");
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  };
  if (!isAuthenticated)
    return (
      <>
        <Button
          onClick={() => setIsAuthModalOpen(true)}
          variant={"eventoSecondary"}
        >
          Sign-up
        </Button>
        {isAuthModalOpen && (
          <AuthModal
            onAuthSuccess={() => setIsAuthModalOpen(false)}
            onClose={() => setIsAuthModalOpen(false)}
          />
        )}
      </>
    );
  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            disabled={!canBuyMore}
            className="border flex p-2 rounded justify-center items-center w-full"
          >
            {!canBuyMore
              ? "Sold Out"
              : alreadyBought
                ? `You have ${ticketsOwned} ticket${ticketsOwned > 1 ? "s" : ""}. Buy More`
                : "Buy Ticket"}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy Ticket</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <label htmlFor="ticket-qty" className="text-sm font-medium">
              Quantity
            </label>
            <Input
              id="ticket-qty"
              type="number"
              min={1}
              max={maxQuantity}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.min(Number(e.target.value), maxQuantity))
              }
            />
            <p className="text-xs text-muted-foreground">
              Max available: {maxQuantity}
            </p>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleBuy}
              disabled={loading || quantity < 1 || quantity > maxQuantity}
            >
              {loading ? "Processing…" : `Confirm (${quantity})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>{" "}
    </>
  );
}
