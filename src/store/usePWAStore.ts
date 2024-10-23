import { fetchData, HttpMethod } from "@/utils/fetchData";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PWAPermissionState {
  // Notifications
  notificationPermission: NotificationPermission | null; // current user browser permission
  pwaSubscription: PushSubscription | null; // current user browser subscription
  pwaNotification: boolean; // is current user enabled notification
  // Geolocalisation
  geolocationPermission: PermissionState | null;

  // Methods to set navigator permissions
  setNotificationPermission: (permission: NotificationPermission) => void;
  setGeolocationPermission: (permission: PermissionState) => void;
  setPwaSubscription: (subscription: PushSubscription | null) => void;
  setPwaNotification: (token: string) => void;

  // Push subscription related
  subscribeToPush: (
    subscription: PushSubscription,
    browser: string,
    token: string | null,
  ) => void;
  unsubscribeFromPush: (browser: string, token: string | null) => void;

  // Loader for checking permissions
  checkPermissions: () => Promise<void>;
  requestNotificationPermission: () => Promise<void>;
}

// Custom localStorage wrapper to conform to zustand's PersistStorage type
const localStorageCustom = {
  getItem: (name: string) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

export const usePWAStore = create<PWAPermissionState>()(
  persist(
    (set, get) => ({
      notificationPermission: null,
      geolocationPermission: null,
      pwaSubscription: null,
      pwaNotification: false,

      setPwaNotification: (token) => {
        fetchData(
          "/profile/updateProfile",
          HttpMethod.PUT,
          { pwaNotification: !get().pwaNotification }, // Use state getter
          token,
        ).then((response) => {
          console.log("Updated profile notification status:", response);
          set((state) => ({ pwaNotification: !state.pwaNotification }));
        });
      },

      setPwaSubscription: (subscription) =>
        set({ pwaSubscription: subscription }),

      setNotificationPermission: (permission) => {
        set({ notificationPermission: permission });
      },

      setGeolocationPermission: (permission) => {
        set({ geolocationPermission: permission });
      },

      subscribeToPush: (subscription, browser, token) => {
        set({ pwaSubscription: subscription });
        fetchData(
          "/profile/updateProfile",
          HttpMethod.PUT,
          {
            pwaSubscription: subscription,
            browser,
          },
          token,
        );
      },
      unsubscribeFromPush: (browser, token) => {
        set({ pwaSubscription: null });
        fetchData(
          "/profile/updateProfile",
          HttpMethod.PUT,
          { pwaSubscription: null, browser },
          token,
        );
      },

      // Checking permissions
      checkPermissions: async () => {
        const notificationPermission = Notification.permission;
        set({ notificationPermission });
        try {
          const geoPermission = await navigator.permissions.query({
            name: "geolocation",
          });
          set({ geolocationPermission: geoPermission.state });
        } catch (err) {
          console.error("Error checking geolocation permission", err);
        }
      },
      // Request notification permissions from the user
      requestNotificationPermission: async () => {
        console.log("REQUEST");
        const permission = await Notification.requestPermission();
        set({ notificationPermission: permission });
        console.log("Notification permission status:", permission);
      },
    }),
    {
      name: "pwa-store",
      storage: localStorageCustom, // Utilisation du custom storage
    },
  ),
);
