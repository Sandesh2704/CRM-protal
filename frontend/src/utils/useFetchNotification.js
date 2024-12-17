import { useEffect, useState } from "react";
import { useAuth } from "../authProvider/AuthProvider";
import axios from "axios";

export const useFetchNotification = () => {
  const { user, token } = useAuth();
  const userId = user?._id;

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (userId) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DOMAIN_URL}/notificationManage/getNotification/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data;
        setNotifications(data);

        const unread = data.filter((notification) => !notification.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [userId]);
  
  const handleMarkRead = async (notificationId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DOMAIN_URL}/notificationManage/markRead/${notificationId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // If successful, update the notifications state to reflect the change
      if (response.status === 200) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification._id === notificationId
              ? { ...notification, read: true }  // Mark it as read
              : notification
          )
        );
        setUnreadCount((prevUnreadCount) => prevUnreadCount - 1);
      
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkReadAll = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DOMAIN_URL}/notificationManage/markAllRead/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.status === 200) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) => ({
            ...notification,
            read: true,  // Mark all as read
          }))
        );
        setUnreadCount(0);  // Reset unread count
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };


  return { notifications, unreadCount, fetchNotifications,  handleMarkReadAll, handleMarkRead,  };
};