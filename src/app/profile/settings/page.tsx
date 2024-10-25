"use client";

import ComingSoon from "@/components/ComingSoon";
import ToggleSwitch from "@/components/ToggleSwitch";
import { useSession } from "@/contexts/SessionProvider";
import DeleteAccountBtn from "@/features/auth/components/DeleteAccountBtn";
import LogoutBtn from "@/features/auth/components/LogoutBtn";
import InstallPWAButton from "@/features/pwa/InstallPWAButton";
import { cn } from "@/lib/utils";
import { usePWAStore } from "@/store/usePWAStore";
import { useEffect, useState } from "react";

const Page = () => {
  const { token } = useSession();
  const {
    requestNotificationPermission,
    notificationPermission,
    pwaNotification,
    geolocationAutorization,
    setGeolocationAutorization,
    geolocationPermission,
    requestLocationPermission,
    setPwaNotification,
    currentBrowser,
  } = usePWAStore();
  const [isLocalStorageAvailable, setIsLocalStorageAvailable] = useState(true);
  const [isSessionStorageAvailable, setIsSessionStorageAvailable] =
    useState(true);
  const [serviceWorkerStatus, setServiceWorkerStatus] =
    useState<string>("Not Registered");
  const [pushSubscription, setPushSubscription] = useState<string | null>(null);

  // Vérifier la disponibilité de localStorage
  const checkLocalStorageAvailability = () => {
    try {
      const testKey = "test";
      localStorage.setItem(testKey, "testValue");
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Vérifier la disponibilité de sessionStorage
  const checkSessionStorageAvailability = () => {
    try {
      const testKey = "test";
      sessionStorage.setItem(testKey, "testValue");
      sessionStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    // Vérifier la disponibilité du localStorage et du sessionStorage
    setIsLocalStorageAvailable(checkLocalStorageAvailability());
    setIsSessionStorageAvailable(checkSessionStorageAvailability());
  }, []);
  const handleToggleNotification = () => {
    if (notificationPermission !== "granted") requestNotificationPermission();
    if (token) {
      setPwaNotification(!pwaNotification, token);
    }
  };

  const handleToggleLocation = () => {
    if (geolocationPermission !== "granted") requestLocationPermission();
    setGeolocationAutorization(!geolocationAutorization);
  };

  useEffect(() => {
    // Vérification du Service Worker et de la souscription Push
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          setServiceWorkerStatus("Registered");
          return registration.pushManager.getSubscription();
        })
        .then((subscription) => {
          if (subscription) {
            setPushSubscription(subscription.endpoint);
          } else {
            setPushSubscription("No Subscription");
          }
        })
        .catch((error) => {
          console.error(
            "Error checking service worker or subscription:",
            error,
          );
          setServiceWorkerStatus("Error");
        });
    }
  }, []);

  return (
    <>
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        {/* Page header */}
        <div className="pb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-600">
            Manage your account and privacy settings
          </p>
        </div>

        {/* Account settings section */}
        <section className="space-y-4">
          <ul className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Account Settings
            </h2>
            <li
              className={`flex justify-between items-center bg-white shadow-sm rounded-lg p-4`}
            >
              <span className="text-gray-700">Logout</span>
              <LogoutBtn />
            </li>
            <li className="flex justify-between items-center bg-white shadow-sm rounded-lg p-4">
              <span className="text-gray-700">Delete Account</span>
              <DeleteAccountBtn />
            </li>
          </ul>
        </section>

        {/* Permissions Settings */}
        <section className="space-y-4">
          <h2 className="text-xl">
            Permissions Settings{" "}
            <span className="text-xs text-muted-foreground italic">
              Under Development
            </span>
          </h2>
          <div className="bg-yellow-200 text-yellow-800 p-4 rounded-lg">
            <p>localStorage status: {isLocalStorageAvailable.toString()}</p>
            <p>sessionStorage status: {isSessionStorageAvailable.toString()}</p>
          </div>

          <div
            className={cn(
              notificationPermission === "granted"
                ? "bg-evento-gradient text-white"
                : notificationPermission === "denied"
                  ? "bg-red-500 text-white"
                  : "bg-white",
              `flex justify-between items-center shadow-sm rounded-lg p-4`,
            )}
          >
            <div className="flex flex-col">
              <h4>Notifications</h4>
              <ul className="text-xs italic">
                <li>Browser: {currentBrowser}</li>
                <li>Service Worker Status: {serviceWorkerStatus}</li>
                <li className="break-all">
                  Push Subscription: {pushSubscription}
                </li>
                <li>Notification Permission: {notificationPermission}</li>
              </ul>
            </div>
            <ToggleSwitch
              isToggled={pwaNotification}
              onToggle={handleToggleNotification}
            />
          </div>
          <div
            className={cn(
              geolocationPermission === "granted"
                ? "bg-evento-gradient text-white"
                : geolocationPermission === "denied"
                  ? "bg-red-400 text-white"
                  : "bg-white",
              `flex justify-between items-center shadow-sm rounded-lg p-4`,
            )}
          >
            <span>Location</span>
            <ToggleSwitch
              isToggled={geolocationAutorization}
              onToggle={handleToggleLocation}
            />
          </div>
          <InstallPWAButton />
        </section>

        {/* Security settings section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Security Settings
          </h2>
          <div className="bg-white shadow-sm rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Two-Factor Authentication</span>
              <ComingSoon message=" " className="flex-row" />
            </div>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Change Password</span>
              <ComingSoon message=" " className="flex-row" />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Page;
