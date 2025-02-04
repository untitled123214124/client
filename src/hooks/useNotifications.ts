import { useState } from "react";

const useNotifications = () => {
  const [notifications, setNotifications] = useState<any>([
    { text: "This is a notification", date: "02-01-25", read: true },
    { text: "This is another notification", date: "02-01-25", read: false },
  ]);

  return { notifications, setNotifications };
};

export default useNotifications;
