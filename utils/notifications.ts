/**
 * Requests permission for web notifications if not already granted.
 */
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) return;
  
  if (Notification.permission === "default") {
    try {
      await Notification.requestPermission();
    } catch (e) {
      console.error("Error requesting notification permission", e);
    }
  }
};

/**
 * Sends a notification with the given title and body.
 */
export const sendNotification = (title: string, body: string) => {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    try {
      new Notification(title, {
        body,
        // On mobile, the app icon is usually used, but we can try to set one if we had assets
        tag: 'medication-available', // Prevents spamming multiple notifications
        requireInteraction: true, // Keep it visible until user interacts
      });
    } catch (e) {
      console.error("Failed to send notification", e);
    }
  }
};