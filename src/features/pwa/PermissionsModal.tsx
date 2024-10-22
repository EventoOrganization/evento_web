"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useEffect, useState } from "react";

const PermissionsModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [missingPermissions, setMissingPermissions] = useState<string>("both");
  const { toast } = useToast();
  const sessionStorageKey = "permissionsPromptShown";
  const localStorageKey = "userPermissions";
  const [browserName, setBrowserName] = useState<string>("");
  const updatePermissionsStatus = async () => {
    const geoPermission = await navigator.permissions.query({
      name: "geolocation",
    });
    const notificationPermission = await navigator.permissions.query({
      name: "notifications",
    });

    // Update local storage based on actual browser permission status
    const existingPermissions = JSON.parse(
      localStorage.getItem(localStorageKey) || "{}",
    );

    existingPermissions.geolocation = geoPermission.state;
    existingPermissions.notifications = notificationPermission.state;

    localStorage.setItem(localStorageKey, JSON.stringify(existingPermissions));

    // Determine if there are any missing permissions now
    determineMissingPermissions(existingPermissions);
  };
  useEffect(() => {
    const userAgent = navigator.userAgent;

    if (userAgent.indexOf("Firefox") > -1) {
      setBrowserName("Firefox");
    } else if (
      userAgent.indexOf("Edg") > -1 ||
      userAgent.indexOf("Edge") > -1
    ) {
      setBrowserName("Edge");
    } else if (
      userAgent.indexOf("Safari") > -1 &&
      userAgent.indexOf("Chrome") === -1
    ) {
      setBrowserName("Safari");
    } else if (userAgent.indexOf("Chrome") > -1) {
      setBrowserName("Chrome");
    } else {
      setBrowserName("Other");
    }
  }, []);

  useEffect(() => {
    const sessionPrompt = sessionStorage.getItem(sessionStorageKey);
    if (sessionPrompt) return; // Don't show the modal if prompted already in this session

    const existingPermissions = JSON.parse(
      localStorage.getItem(localStorageKey) || "{}",
    );
    if (
      !existingPermissions.geolocation ||
      !existingPermissions.notifications
    ) {
      // Set initial permissions if none exist
      localStorage.setItem(
        localStorageKey,
        JSON.stringify({
          geolocation: "modalRefused",
          notifications: "modalRefused",
        }),
      );
    } else {
      // Update permissions status from the browser
      updatePermissionsStatus();
    }

    setIsOpen(true);
  }, []);

  const determineMissingPermissions = (permissions: any) => {
    let missing = "";

    if (
      permissions.notifications !== "granted" &&
      permissions.notifications !== "modalRefused"
    ) {
      missing = "notifications";
    }
    if (
      permissions.geolocation !== "granted" &&
      permissions.geolocation !== "modalRefused"
    ) {
      missing = missing ? "both" : "geolocation";
    }

    // Only show modal if there are still permissions to grant
    if (missing) {
      setMissingPermissions(missing);
      setIsOpen(true); // Show modal if permissions are missing
    } else {
      setIsOpen(false); // Do not show modal if permissions are already granted
    }
  };

  const requestGeolocationPermission = async () => {
    const geoPermission = await navigator.permissions.query({
      name: "geolocation",
    });
    let geoStatus = geoPermission.state;

    if (geoStatus === "prompt") {
      geoStatus = await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => resolve("granted"),
          () => resolve("denied"),
        );
      });
    }

    toast({
      title: "Geolocation Permission",
      description:
        geoStatus === "granted"
          ? "Location access granted"
          : "Location access denied",
    });
    console.log(geoStatus);
    return geoStatus;
  };

  const requestNotificationPermission = async () => {
    let notificationStatus = Notification.permission;
    if (notificationStatus === "default") {
      notificationStatus = await Notification.requestPermission();
    }

    toast({
      title: "Notification Permission",
      description:
        notificationStatus === "granted"
          ? "Notifications enabled"
          : "Notifications denied",
    });

    return notificationStatus;
  };

  const requestPermissions = async () => {
    try {
      const existingPermissions = JSON.parse(
        localStorage.getItem(localStorageKey) || "{}",
      );

      let geoStatus = existingPermissions.geolocation;
      if (geoStatus === "modalRefused") {
        geoStatus = await requestGeolocationPermission();
        existingPermissions.geolocation = geoStatus;
        localStorage.setItem(
          localStorageKey,
          JSON.stringify(existingPermissions),
        );
        sessionStorage.setItem(sessionStorageKey, "true");
      }

      let notificationStatus = existingPermissions.notifications;
      if (notificationStatus === "modalRefused") {
        notificationStatus = await requestNotificationPermission();
        existingPermissions.notifications = notificationStatus;
        localStorage.setItem(
          localStorageKey,
          JSON.stringify(existingPermissions),
        );
        sessionStorage.setItem(sessionStorageKey, "true");
      }

      sessionStorage.setItem(sessionStorageKey, "true");

      // Ferme la modal après que les permissions ont été demandées
      setIsOpen(false);
    } catch (error) {
      console.error("Error requesting permissions:", error);
    }
  };

  const handleRefuse = () => {
    const existingPermissions = JSON.parse(
      localStorage.getItem(localStorageKey) || "{}",
    );

    localStorage.setItem(
      localStorageKey,
      JSON.stringify({
        geolocation: existingPermissions.geolocation || "modalRefused",
        notifications: existingPermissions.notifications || "modalRefused",
      }),
    );

    toast({
      title: "Permissions Refused",
      variant: "destructive",
      description:
        "You can change these settings in your browser if you change your mind.",
    });

    sessionStorage.setItem(sessionStorageKey, "refused");
    setIsOpen(false);
  };

  const renderDescription = () => {
    switch (missingPermissions) {
      case "both":
        return "We need your permission to access your location and notifications for a better experience.";
      case "notifications":
        return "We need your permission to send notifications for important updates.";
      case "geolocation":
        return "We need your permission to access your location to show nearby events.";
      default:
        return "";
    }
  };

  const renderBrowserInstructions = () => {
    switch (browserName) {
      case "Chrome":
        return (
          <div className="flex flex-col w-full">
            <p>To enable permissions in Chrome, visit: </p>
            <Link
              href="https://support.google.com/chrome/answer/114662"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-400"
            >
              How to Change Site Permissions in Chrome
            </Link>
            <Button variant="outline" onClick={handleRefuse}>
              Refuse
            </Button>
          </div>
        );
      case "Firefox":
        return (
          <div className="flex flex-col w-full">
            <p>To enable permissions in Firefox, visit: </p>
            <Link
              href="https://support.mozilla.org/en-US/kb/permission-request-messages-firefox"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-400"
            >
              How to Change Site Permissions in Firefox
            </Link>
          </div>
        );
      case "Safari":
        return (
          <div className="flex flex-col w-full">
            <p>To enable permissions in Safari, visit: </p>
            <Link
              href="https://support.apple.com/guide/safari/change-websites-preferences-sfri11071/mac"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-400"
            >
              How to Change Site Permissions in Safari (macOS)
            </Link>
          </div>
        );
      case "Edge":
        return (
          <div className="flex flex-col w-full">
            <p>To enable permissions in Edge, visit: </p>
            <Link
              href="https://support.microsoft.com/en-us/microsoft-edge/how-to-manage-site-permissions-on-the-new-microsoft-edge-9f1c9240-2075-a3a1-d649-4b7d2f6a318f"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-400"
            >
              How to Change Site Permissions in Edge
            </Link>
            <Button variant="outline" onClick={handleRefuse}>
              Refuse
            </Button>
          </div>
        );
      default:
        return <p>Visit your browser&apos;s settings to manage permissions.</p>;
    }
  };

  const renderButtons = () => {
    const permissions = JSON.parse(
      localStorage.getItem(localStorageKey) || "{}",
    );

    // If permissions are denied by the browser, don't show buttons, instead show a link for instructions
    if (
      permissions.notifications === "denied" ||
      permissions.geolocation === "denied"
    ) {
      return renderBrowserInstructions();
    }

    // Show the accept/refuse buttons if not browser-denied
    return (
      <>
        <Button variant="outline" onClick={handleRefuse}>
          Refuse
        </Button>
        <Button onClick={requestPermissions} autoFocus>
          Accept All
        </Button>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[95%] rounded md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Permissions Required</DialogTitle>
          <DialogDescription>{renderDescription()}</DialogDescription>
        </DialogHeader>
        <DialogFooter>{renderButtons()}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionsModal;
