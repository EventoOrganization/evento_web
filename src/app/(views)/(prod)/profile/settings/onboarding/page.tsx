"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StripeOnboardingCheck() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(
    "⏳ Vérification de votre compte Stripe…",
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // const checkStatus = async () => {
    //   const res = await fetch("/api/me/profile");
    //   const json = await res.json();
    //   const stripeAccount = json.data?.stripeAccounts?.[0];

    //   if (stripeAccount?.chargesEnabled) {
    //     clearInterval(timer);
    //     router.push("/profile/settings/onboarding/success");
    //   } else {
    //     setMessage(
    //       "⏳ Votre compte est en cours de validation, ça peut prendre quelques secondes…",
    //     );
    //   }
    // };

    // check immédiatement puis toutes les 3s
    // checkStatus();
    // timer = setInterval(checkStatus, 3000);

    // return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-xl font-bold">{message}</h1>
    </div>
  );
}
