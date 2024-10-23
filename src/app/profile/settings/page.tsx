"use client";

import ComingSoon from "@/components/ComingSoon";
import ToggleSwitch from "@/components/ToggleSwitch";
import { useSession } from "@/contexts/SessionProvider";
import DeleteAccountBtn from "@/features/auth/components/DeleteAccountBtn";
import LogoutBtn from "@/features/auth/components/LogoutBtn";
import InstallPWAButton from "@/features/pwa/InstallPWAButton";
import { cn } from "@/lib/utils";
import { usePWAStore } from "@/store/usePWAStore";

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
  } = usePWAStore();

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
          <h2 className="text-xl">Permissions Settings</h2>
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
            <span>Notifications</span>
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
