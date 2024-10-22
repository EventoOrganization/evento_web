"use client";
import React, { createContext, ReactNode, useEffect, useState } from "react";

interface PwaContextType {
  notificationsPermission: NotificationPermission | null;
  geoPermission: PermissionState | null;
  requestNotificationPermission: () => void;
  requestGeoPermission: () => void;
}

const PwaContext = createContext<PwaContextType | undefined>(undefined);

interface PwaProviderProps {
  children: ReactNode;
}

export const PwaProvider: React.FC<PwaProviderProps> = ({ children }) => {
  const [notificationsPermission, setNotificationsPermission] =
    useState<NotificationPermission | null>(null);
  const [geoPermission, setGeoPermission] = useState<PermissionState | null>(
    null,
  );

  // Check permissions on load
  useEffect(() => {
    setNotificationsPermission(Notification.permission);
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      setGeoPermission(result.state);
    });
  }, []);

  const requestNotificationPermission = () => {
    Notification.requestPermission().then((permission) => {
      setNotificationsPermission(permission);
    });
  };

  const requestGeoPermission = () => {
    navigator.geolocation.getCurrentPosition(
      () => {
        setGeoPermission("granted");
      },
      () => {
        setGeoPermission("denied");
      },
    );
  };

  return (
    <PwaContext.Provider
      value={{
        notificationsPermission,
        geoPermission,
        requestNotificationPermission,
        requestGeoPermission,
      }}
    >
      {children}
    </PwaContext.Provider>
  );
};

export default PwaContext;
