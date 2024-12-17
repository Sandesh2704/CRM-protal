import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Section from "../../component/Section"
import Heading from "./Heading"
import { FaBell, } from "react-icons/fa6";
import { useFetchNotification } from "../../utils/useFetchNotification"
import { useAuth } from '../../authProvider/AuthProvider';
import { BsThreeDotsVertical } from "react-icons/bs";
import { useState } from 'react';

export default function Notification() {
  const { userJobPosition } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate
  const { notifications, handleMarkRead, handleMarkReadAll, unreadCount, } = useFetchNotification()

  const [popupVisible, setPopupVisible] = useState(false); // State for the popup visibility
  const [popupNotification, setPopupNotification] = useState(null); // Store the notification for the popup


  const handleNotificationClick = async (notification) => {
    // Mark notification as read when clicked
    await handleMarkRead(notification._id);  // Pass the notification ID to mark it as read
    // Navigate to appropriate task page
    if (notification.type === 'task') {
      if (notification.taskType === 'new') {
        navigate(
          userJobPosition === 'Founder'
            ? `/founder/your-task`
            : userJobPosition === 'Manager'
              ? `/manager/your-task`
              : userJobPosition === 'Team Leader'
                ? `/team-leader/your-task`
                : userJobPosition === 'Employee'
                  ? `/employee/your-task`
                  : '/not-found'
        )

        
      } else if (notification.taskType === 'update') {
        navigate(
          userJobPosition === 'Founder'
            ? `/founder/task-update`
            : userJobPosition === 'Manager'
              ? `/manager/task-update`
              : userJobPosition === 'Team Leader'
                ? `/team-leader/task-update`
                : userJobPosition === 'Employee'
                  ? `/employee/task-update`
                  : '/not-found'
        );
      }
    }
  };

  const handlePopupClick = (notification) => {
    // Toggle popup visibility
    setPopupNotification(notification);
    setPopupVisible(prev => !prev);
  };

  return (
    <>
      <Section>
        <div className=" flex justify-between flex-col sm:flex-row gap-y-9">
          <Heading icon={<FaBell />} title="Notification" />
          <div className="w-full flex justify-between sm:justify-end gap-5 mr-4">
            <button
              className="text-blue-500 text-sm"
              onClick={handleMarkReadAll}>
              Mark all as read
            </button>

            <button
              className="relative flex items-center">
              <span className='text-gray-500'> <FaBell size={24} /></span>

              {unreadCount > 0 && (
                <span className="absolute w-4 h-4 flex justify-center items-center -top-1 -right-2 bg-red-500 text-white text-[10px] rounded-full ">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </Section>
      {notifications && notifications.length > 0 ? (
        <Section>
          {notifications.map(notification => (
            <div
              key={notification._id}
              className={`relative flex items-center justify-between py-3 border-b ${notification.read ? 'bg-white' : 'px-2 bg-purple-200/40'}`}

            >
              <div className='cursor-pointer'
                state={{ assignTaskDetails: notification }}
                onClick={() => handleNotificationClick(notification)}>
                <p className="text-sm"  >{notification.message}</p>
                <span className="text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>


              {/* Three-dot icon */}
              <div className="">
                <BsThreeDotsVertical
                  onClick={() => handlePopupClick(notification)}
                  className="cursor-pointer text-lg text-gray-600 md:mr-1"
                />
              </div>

              {/* Show "Mark as Read" button if the notification is selected */}
              {popupVisible && popupNotification?._id === notification._id && (
                <div className="absolute z-40 flex flex-col top-10 right-3 bg-white p-3 border rounded-md shadow-md">

                  <button
                    onClick={async () => {
                      await handleMarkRead(notification._id); // Mark the notification as read
                      setPopupVisible(false); // Close the popup after marking as read
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Mark as Read
                  </button>

                  {/* You can add more actions or details here if needed */}
                  <button
                    onClick={() => setPopupVisible(false)} // Close the popup without marking as read
                    className="mt-2 text-sm text-gray-500"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          ))}
        </Section>
      ) : (
        <Section>
          <div className="text-center text-xl py-20 text-blue-600">
            No Notification
          </div>
        </Section>
      )}
    </>
  );
}