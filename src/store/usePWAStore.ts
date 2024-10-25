import { fetchData, HttpMethod } from "@/utils/fetchData";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PWAPermissionState {
  // Notifications
  notificationPermission: NotificationPermission | null; // current user browser permission
  pwaSubscription: PushSubscription | null; // current user browser subscription
  pwaNotification: boolean; // is current user enabled notification
  currentBrowser: string;
  // Geolocalisation
  geolocationPermission: PermissionState | null;
  geolocationAutorization: boolean; // is current user enable geolocation
  // Methods to set navigator permissions
  setNotificationPermission: (permission: NotificationPermission) => void;
  setGeolocationPermission: (permission: PermissionState) => void;
  setPwaSubscription: (subscription: PushSubscription | null) => void;
  setPwaNotification: (newState: boolean, token: string) => void;
  setGeolocationAutorization: (newState: boolean) => void;
  setCurrentBrowser: (browser: string) => void;
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
  requestLocationPermission: () => Promise<void>;
}

const isLocalStorageAvailable = () => {
  try {
    const testKey = "test";
    localStorage.setItem(testKey, "testValue");
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};
// Custom localStorage wrapper to conform to zustand's PersistStorage type
const localStorageCustom = {
  getItem: (name: string) => {
    if (isLocalStorageAvailable()) {
      const item = localStorage.getItem(name);
      return item ? JSON.parse(item) : null;
    }
    return null;
  },
  setItem: (name: string, value: any) => {
    if (isLocalStorageAvailable()) {
      localStorage.setItem(name, JSON.stringify(value));
    }
  },
  removeItem: (name: string) => {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(name);
    }
  },
};

export const usePWAStore = create<PWAPermissionState>()(
  persist(
    (set, get) => ({
      notificationPermission: null,
      geolocationPermission: null,
      pwaSubscription: null,
      pwaNotification: false,
      geolocationAutorization: false,
      currentBrowser: "",

      setCurrentBrowser: (browser) => {
        set({ currentBrowser: browser });
      },
      setGeolocationAutorization: (newState) => {
        set(() => ({
          geolocationAutorization: newState,
        }));
      },

      setPwaNotification: (newState, token) => {
        fetchData(
          "/profile/updateProfile",
          HttpMethod.PUT,
          { pwaNotification: !get().pwaNotification }, // Use state getter
          token,
        );
        set(() => ({ pwaNotification: newState }));
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
        console.log("Browser", browser);
        console.log("subscription", subscription);
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
        console.log("subscribeToPush called with subscription:", subscription);
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
        console.log("Notification permission:", notificationPermission);
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
        const permission = await Notification.requestPermission();
        if (permission === "granted" || permission === "denied") {
          set({ notificationPermission: permission });
          console.log("Notification permission status:", permission);
        }
      },

      // Request location permissions from the user
      requestLocationPermission: async () => {
        try {
          if ("geolocation" in navigator) {
            const permissionStatus = await navigator.permissions.query({
              name: "geolocation",
            });

            // Si l'état de la permission est 'prompt', cela signifie qu'une demande peut être effectuée
            if (permissionStatus.state === "prompt") {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  console.log("Position actuelle:", position);
                  set({ geolocationPermission: "granted" });
                },
                (error) => {
                  console.error(
                    "Erreur lors de l'obtention de la localisation:",
                    error,
                  );
                  set({ geolocationPermission: "denied" });
                },
              );
            } else {
              set({ geolocationPermission: permissionStatus.state });
            }
          } else {
            console.error(
              "La géolocalisation n'est pas supportée dans ce navigateur.",
            );
          }
        } catch (error) {
          console.error(
            "Erreur lors de la demande de permission de localisation:",
            error,
          );
        }
      },
    }),
    {
      name: "pwa-store",
      storage: localStorageCustom,
    },
  ),
);
