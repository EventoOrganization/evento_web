"use client";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";

export default function StripeOnboardingSuccess() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center relative">
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

      <h1 className="text-3xl font-bold mb-4">
        🎉 Votre compte Stripe est prêt !
      </h1>
      <p className="text-lg mb-6">
        Vous pouvez maintenant recevoir des paiements et vendre sur Evento.
      </p>

      <button
        onClick={() => router.push("/profile/settings")}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        Retour aux paramètres
      </button>
    </div>
  );
}
