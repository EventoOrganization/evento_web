"use client";
import { useGlobalStore } from "@/store/useGlobalStore";
import { usePWAStore } from "@/store/usePWAStore";
import React, { useEffect, useState } from "react";
import { useSession } from "./SessionProvider";

const PWAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  const {
    notificationPermission,
    subscribeToPush,
    unsubscribeFromPush,
    checkPermissions,
    setCurrentBrowser,
  } = usePWAStore();

  const { userInfo } = useGlobalStore();
  const { token } = useSession();

  useEffect(() => {
    setIsClient(true);
    console.log("Component mounted. Set isClient to true.");
  }, []);

  const getBrowserName = (): string => {
    if (!isClient) {
      console.log("isClient is false, returning 'unknown'.");
      return "unknown";
    }
    const ua = navigator.userAgent;
    if (ua.includes("Chrome")) {
      setCurrentBrowser("chrome");
      return "chrome";
    }
    if (ua.includes("Firefox")) {
      setCurrentBrowser("firefox");
      return "firefox";
    }
    if (ua.includes("Safari") && !ua.includes("Chrome")) {
      setCurrentBrowser("safari");
      return "safari";
    }
    setCurrentBrowser("unknown");
    return "unknown";
  };

  useEffect(() => {
    if (!userInfo || !token) {
      console.log("Waiting for user info or token to be available...");
      return;
    }
    console.log(
      `User info and token available. User: ${userInfo?.username}, Token: ${token}`,
    );
    const browser = getBrowserName();
    console.log(`Browser determined: ${browser}`);
    checkPermissions();
    console.log("Permissions checked.");
    const existingSubscription = userInfo?.pwaSubscriptions?.find(
      (sub: any) => sub.browser === browser,
    );
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope,
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
    console.log("Existing subscription:", !!existingSubscription);
    if (notificationPermission === "granted") {
      console.log("Notification permission granted, subscribing to push...");
      console.log("keys", process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY);
      navigator.serviceWorker.ready.then(() =>
        console.log("Service Worker is ready."),
      );
      navigator.serviceWorker.ready
        .then(async (registration) => {
          console.log("Service worker is ready.");
          const subscription = await registration.pushManager.getSubscription();
          console.log("Existing subscription:", subscription);
          if (!subscription) {
            // No subscription found, we need to subscribe
            console.log("No subscription found, subscribing now...");
            try {
              console.log("Subscribing to push...");
              const newSubscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
              });
              console.log("New subscription obtained:", newSubscription);
              subscribeToPush(newSubscription, browser, token);
            } catch (err) {
              console.error("Failed to subscribe to push", err);
            }
          } else {
            // Handle existing subscription
            if (
              existingSubscription &&
              subscription.endpoint === existingSubscription?.endpoint
            ) {
              console.log("Subscription is up to date");
            } else {
              console.log("Updating existing subscription");
              subscribeToPush(subscription, browser, token);
            }
          }
        })
        .catch((err) => {
          console.log("Failed to get service worker registration:", err);
          console.error("ServiceWorker registration error:", err);
        });
    } else {
      if (existingSubscription) {
        unsubscribeFromPush(browser, token);
      } else return;
    }
  }, [notificationPermission, isClient, token, userInfo]);

  return <>{children}</>;
};

export default PWAProvider;
