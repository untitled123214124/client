import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Notification {
  _id: string;
  message: string;
  createdAt: string;
  postId: string;
}

const NotificationList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const userId = 'userId'; 
    axios.get(`/api/notifications`, { params: { userId } })
      .then(response => {
        setNotifications(response.data);
      })
      .catch(error => {
        console.error('알림을 가져오는 데 실패했습니다:', error);
      });
  }, []);

  const handleNotificationClick = (postId: string) => {
    window.location.href = `/post/${postId}`;
  };

  return (
    <div>
      <h2>알림</h2>
      {notifications.length > 0 ? (
        notifications.map(notification => (
          <div key={notification._id} onClick={() => handleNotificationClick(notification.postId)}>
            <p>{notification.message}</p>
            <small>{new Date(notification.createdAt).toLocaleString()}</small>
          </div>
        ))
      ) : (
        <p>새로운 알림이 없습니다.</p>
      )}
    </div>
  );
};

export default NotificationList;
