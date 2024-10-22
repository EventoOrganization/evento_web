import PwaContext from "@/contexts/PwaProvider";
import React, { useContext } from "react";

const NotificationsModal: React.FC = () => {
  const pwaContext = useContext(PwaContext);

  if (!pwaContext) {
    throw new Error("PwaContext must be used within a PwaProvider");
  }

  const { notificationsPermission, requestNotificationPermission } = pwaContext;

  return (
    <div>
      {notificationsPermission === "default" && (
        <div className="modal">
          <p>
            We need your permission to send notifications about important
            updates.
          </p>
          <button onClick={requestNotificationPermission}>
            Allow Notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsModal;
