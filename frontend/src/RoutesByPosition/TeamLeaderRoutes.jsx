import { Route, Routes, } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../authProvider/AuthProvider';
import axios from 'axios';


import Layout from '../layout/Layout';
import Dashboard from '../pages/teamLeader/Dashboard';
import TeamMember from '../pages/teamLeader/TeamMember';
import TaskUpdateList from '../pages/teamLeader/TaskUpdateList';
import AddTeamMember from '../pages/teamLeader/AddTeamMember';


import StaffDetail from '../pages/details-pages/StaffDetail.jsx';
import AssignTaskDetails from '../pages/details-pages/AssignTaskDetails';
import YourTaskDetails from '../pages/details-pages/YourTaskDetails.jsx';

import AssignTask from '../pages/common-pages/AssignTask';
import Profile from '../pages/common-pages/Profile.jsx';
import TeamDailyUpdate from '../pages/common-pages/TeamDailyUpdate.jsx';
import YourTaskList from '../pages/common-pages/YourTaskList';
import DailyUpdateFrom from '../pages/common-pages/DailyUpdateFrom';
import Notification from '../pages/common-pages/Notification.jsx';
import { useFetchYourTasks } from '../utils/useFetchYourTasks.js';

export default function TeamLeaderRoutes() {

  const { user } = useAuth();
  const parentId = user?._id;
  const [staffData, setStaffData] = useState([])
  const { yourTasks, fetchTasks, yourPendingTasks } = useFetchYourTasks();

  const fetchteamLeadersList = async () => {
    if (parentId) {
      try {
        console.log('Fetching team members for:', parentId);
        const response = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/userManage/user/${parentId}`);
        console.log('Team members fetched:', response.data);


        const users = response.data.users;
        setStaffData(users);
      } catch (error) {
        console.error('Failed to load team members:', error.response?.data || error.message);
      }
    } else {
      console.log("No team leader ID available");
    }
  };

  useEffect(() => {
    fetchteamLeadersList();
  }, [parentId]);


  return (
    <>
      <Routes>
        {/* Parent route with Layout component */}
        <Route path="" element={<Layout />}>
          {/* Nested routes */}
          <Route index element={<Dashboard staffData={staffData} yourTasks={yourTasks} yourPendingTasks={yourPendingTasks} />} />
          <Route path="profile" element={<Profile />} />
          <Route path="team-members" element={<TeamMember staffData={staffData} />} />
          <Route path="add-new-team-members" element={<AddTeamMember fetchteamLeadersList={fetchteamLeadersList} />} />
          <Route path="your-task" element={<YourTaskList yourTasks={yourTasks} />} />
          <Route path="assign-task" element={<AssignTask staffData={staffData} />} />
          <Route path="task-update" element={<TaskUpdateList />} />
          <Route path="daily-update-form" element={<DailyUpdateFrom />} />
          <Route path="team-daily-update" element={<TeamDailyUpdate />} />
          <Route path="staffDeatils/:slug" element={<StaffDetail />} />
          <Route path="assignTaskDetails/:slug" element={<AssignTaskDetails />} />
          <Route path="yourTaskDetails/:slug" element={<YourTaskDetails fetchTasks={fetchTasks} />} />
          <Route path="notification" element={<Notification />} />
        </Route>
      </Routes>
    </>
  )
}