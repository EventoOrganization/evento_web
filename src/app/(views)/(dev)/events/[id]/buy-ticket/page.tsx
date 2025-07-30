"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { EventType } from "@/types/EventType";
import { HttpMethod, fetchData } from "@/utils/fetchData";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
export default function BuyTicketPage() {
  const router = useRouter();
  const { token, user } = useSession();
  const params = useParams();
  const eventId = params?.id as string;
  const [message, setMessage] = useState("⏳ Checking your tickets...");
  const [showConfetti, setShowConfetti] = useState(false);
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const isBuyer = event?.soldTickets?.find((b) => b.buyerId === user?._id);
  const ticketsOwned =
    event?.soldTickets
      ?.filter((t) => t.buyerId === user?._id)
      ?.reduce((acc, t) => acc + (t.quantity || 0), 0) ?? 0;

  const alreadyBought = ticketsOwned > 0;
  const fetchEvent = async () => {
    if (!eventId || !token) return;
    setLoading(true);
    const res = await fetchData(
      `/events/getEvent/${eventId}`,
      HttpMethod.GET,
      null,
      token,
    );
    if (res.ok) setEvent(res.data as EventType);
    console.log("✅ Event response:", res);

    setLoading(false);
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId, token]);

  useEffect(() => {
    console.log("🎫 Already bought:", alreadyBought);
    console.log("🎫 ticketsOwned:", ticketsOwned);
    console.log("🎫 isBuyer:", isBuyer);
    if (!alreadyBought && !loading) {
      setMessage("❌ No ticket Found.");
      return;
    }
    if (alreadyBought && isBuyer) {
      setMessage(
        "🎉 You've got " +
          ticketsOwned +
          ` ticket${ticketsOwned > 1 ? "s" : ""} for this event!`,
      );
      alreadyBought && setShowConfetti(true);
    }
  }, [loading]);
  console.log("📦 Event:", event);

  return (
    <>
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
            {message}
            {loading && (
              <Loader2 className="animate-spin w-5 h-5 text-muted-foreground" />
            )}
          </h1>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-sm text-muted-foreground cursor-default border p-3 rounded-lg bg-muted w-fit">
              🔍 View tickets details
            </div>
          </TooltipTrigger>
          <TooltipContent className="text-sm text-muted-foreground max-w-xs text-left">
            {event && event.details && (
              <div className="flex flex-col gap-1">
                <div>
                  <strong>🎫 Tickets:</strong> {ticketsOwned}
                </div>
                <div>
                  <strong>💰 Price:</strong>{" "}
                  {event?.ticketing
                    ? `${(event.ticketing.price / 100).toFixed(2)} ${
                        event.ticketing.currency.toUpperCase() || "EUR"
                      }`
                    : "N/A"}
                </div>
                <div>
                  <strong>🗓️ Date:</strong>{" "}
                  {new Date(event.details.date || "").toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Asia/Ho_Chi_Minh",
                  })}
                </div>
                <div>
                  <strong>📍 Location:</strong>{" "}
                  {event.details.mode === "in-person"
                    ? event.details.location || "N/A"
                    : "Online event"}
                </div>
                <div>
                  <strong>👥 Guests:</strong> {event.tempGuests?.length || 0}
                </div>
                <div>
                  <strong>📄 Sheet:</strong>{" "}
                  <a
                    href={event.googleSheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Open Sheet
                  </a>
                </div>
                <div>
                  <strong>🆔 Buyer ID:</strong>{" "}
                  <code className="text-xs">{user?._id}</code>
                </div>
              </div>
            )}
          </TooltipContent>
        </Tooltip>

        <Button
          className="mt-6"
          onClick={() => router.push(`/events/${eventId}`)}
        >
          Back to event
        </Button>
      </div>
    </>
  );
}
