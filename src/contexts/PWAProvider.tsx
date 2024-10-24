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
  }, []);

  const getBrowserName = (): string => {
    if (!isClient) {
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
    const browser = getBrowserName();
    const existingSubscription = userInfo?.pwaSubscriptions?.find(
      (sub: any) => sub.browser === browser,
    );

    checkPermissions();

    if (notificationPermission === "granted") {
      navigator.serviceWorker.ready
        .then(async (registration) => {
          const subscription = await registration.pushManager.getSubscription();
          if (!subscription) {
            // No subscription found, we need to subscribe
            console.log("No subscription found, subscribing now...");
            try {
              const newSubscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
              });
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
