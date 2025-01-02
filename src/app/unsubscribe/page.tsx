"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/togglerbtn";
import { useToast } from "@/hooks/use-toast";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const UnsubscribePage = () => {
  const searchParams = useSearchParams();
  const unsubscribeToken = searchParams.get("token");
  const [preferences, setPreferences] = useState({
    receiveEventUpdates: true,
    receiveReminders: true,
    receiveInvites: true,
  });
  const [isUnsubscribedAll, setIsUnsubscribedAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  // Charger les préférences à partir du token
  useEffect(() => {
    if (unsubscribeToken) {
      fetchPreferences(unsubscribeToken);
    } else {
      console.error("Token is missing in the URL.");
    }
  }, [unsubscribeToken]);

  const fetchPreferences = async (token: string) => {
    try {
      const response = await fetchData<any>(
        `/profile/getPreferences?token=${token}`,
        HttpMethod.GET,
      );
      console.log("responseGetPreferences", response);
      if (response.ok && response.data.preferences) {
        setPreferences(response.data.preferences);
      } else {
        console.error("Failed to fetch preferences:", response.error);
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePreference = (key: keyof typeof preferences) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      console.log("Updated preferences:", updated);
      return updated;
    });
  };

  const handleUnsubscribeAll = async () => {
    const updatedPreferences = {
      receiveEventUpdates: false,
      receiveReminders: false,
      receiveInvites: false,
    };

    setPreferences(updatedPreferences);
    setIsUnsubscribedAll(true);

    await savePreferences(updatedPreferences);
  };

  const savePreferences = async (updatedPreferences: typeof preferences) => {
    try {
      const response = await fetchData(
        `/profile/updatePreferences`,
        HttpMethod.PUT,
        { token: unsubscribeToken, preferences: updatedPreferences },
      );
      if (!response.ok) {
        toast({
          title: "Failed to save preferences. Please try again.",
          className: "bg-destructive text-destructive-foreground",
        });
      } else {
        toast({
          title: "Preferences saved successfully.",
          className: "bg-evento-gradient text-white",
        });
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "An error occurred while saving your preferences.",
        className: "bg-destructive text-destructive-foreground",
      });
    }
  };

  const handleSavePreferences = async () => {
    setIsUnsubscribedAll(false);
    await savePreferences(preferences);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p>Loading preferences...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center pt-16 bg-gray-100 p-4">
      {!isUnsubscribedAll ? (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Manage Your Email Preferences
          </h1>
          <p className="text-gray-600 mb-6">
            Select the types of emails you&apos;d like to receive or unsubscribe
            completely.
          </p>

          <div className="text-left mb-6">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-gray-800">Receive Event Updates</Label>
              <Switch
                checked={preferences.receiveEventUpdates}
                onCheckedChange={() =>
                  handleTogglePreference("receiveEventUpdates")
                }
              />
            </div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-gray-800">Receive Reminders</Label>
              <Switch
                checked={preferences.receiveReminders}
                onCheckedChange={() =>
                  handleTogglePreference("receiveReminders")
                }
              />
            </div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-gray-800">Receive Invites</Label>
              <Switch
                checked={preferences.receiveInvites}
                onCheckedChange={() => handleTogglePreference("receiveInvites")}
              />
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={handleSavePreferences}
              className="bg-eventoPurpleDark hover:bg-eventoPurpleLight"
            >
              Save Preferences
            </Button>
            <button
              onClick={handleUnsubscribeAll}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
            >
              Unsubscribe All
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Unsubscribed from All
          </h1>
          <p className="text-gray-600 mb-6">
            You have successfully unsubscribed from all email notifications.
          </p>
          <p className="text-gray-600 mb-6">
            If this was a mistake, you can update your preferences below.
          </p>
          <button
            onClick={() => setIsUnsubscribedAll(false)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            Update Preferences
          </button>
        </div>
      )}
    </div>
  );
};

export default UnsubscribePage;
