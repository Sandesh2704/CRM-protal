import { Route, Routes } from 'react-router-dom';

import Layout from '../layout/Layout';
import Dashboard from '../pages/employ/Dashboard';
import DailyUpdateFrom from '../pages/common-pages/DailyUpdateFrom';
import YourTaskDetails from '../pages/details-pages/YourTaskDetails.jsx';
import YourTaskList from '../pages/common-pages/YourTaskList';
import Profile from '../pages/common-pages/Profile.jsx';
import Notification from '../pages/common-pages/Notification.jsx';
import { useFetchYourTasks } from '../utils/useFetchYourTasks.js';

export default function EmployeeRoutes() {


  const { yourTasks, fetchTasks, yourPendingTasks } = useFetchYourTasks();

  return (
    <>
      <Routes>
        {/* Parent route with Layout component */}
        <Route path="/" element={<Layout />}>
          {/* Nested routes */}
          <Route index element={<Dashboard yourTasks={yourTasks} yourPendingTasks={yourPendingTasks} />} />
          <Route path="daily-update-form" element={<DailyUpdateFrom />} />
          <Route path="your-task" element={<YourTaskList yourTasks={yourTasks} />} />
          <Route path="yourTaskDetails/:slug" element={<YourTaskDetails fetchTasks={fetchTasks} />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notification" element={<Notification />} />
        </Route>
      </Routes>
    </>
  )
}