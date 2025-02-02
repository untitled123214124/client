import { useEffect, useState } from "react";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource("https://your-api.com/notifications");

    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prev) => [...prev, newNotification]);
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h2>알림</h2>
      <ul>
        {notifications.map((noti, index) => (
          <li key={index}>{noti.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;