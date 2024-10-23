"use client";
import { usePWAStore } from "@/store/usePWAStore";
import { useEffect, useState } from "react";

// Typing the deferredPrompt to ensure TypeScript recognizes the properties
type DeferredPromptType = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<DeferredPromptType | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const { notificationPermission } = usePWAStore();
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as DeferredPromptType);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Ouvre la boîte de dialogue d'installation
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null); // Reset le prompt
        setIsInstallable(false);
      });
    }
  };

  return (
    <>
      {isInstallable && notificationPermission === "granted" && (
        <div className="flex justify-between items-center bg-white shadow-sm rounded-lg p-4">
          <span>Application</span>
          <button onClick={handleInstallClick} className="install-button">
            Install PWA
          </button>
        </div>
      )}
    </>
  );
};

export default InstallPWAButton;
