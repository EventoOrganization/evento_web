"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useEventStore } from "@/store/useEventsStore";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useState } from "react";

type Props = {
  eventId: string;
};

export default function BuyTicketButton({ eventId }: Props) {
  const { events } = useEventStore();
  const event = events.find((e) => e._id === eventId);
  const maxQuantity = event?.ticketing?.remainingTickets ?? 0;

  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useSession();

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
      // Tu peux ajouter un toast ici pour informer l'utilisateur
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Select
        value={String(quantity)}
        onValueChange={(val) => setQuantity(Number(val))}
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Qty" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: maxQuantity }, (_, i) => (
            <SelectItem key={i + 1} value={String(i + 1)}>
              {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={handleBuy} disabled={loading || maxQuantity < 1}>
        {loading
          ? "Processing…"
          : maxQuantity < 1
            ? "Sold Out"
            : `Buy ${quantity} Ticket${quantity > 1 ? "s" : ""}`}
      </Button>
    </div>
  );
}
