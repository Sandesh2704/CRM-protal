import { Route, Routes, } from 'react-router-dom';
import { useAuth } from '../authProvider/AuthProvider.js';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Dashboard from '../pages/manager/Dashboard';
import Layout from '../layout/Layout';
import TeamLeaders from '../pages/manager/TeamLeaders';
import AddTeamLeader from '../pages/manager/AddTeamLeader';
import AttendanceChart from '../pages/manager/AttendanceChart';
import TaskUpdateList from '../pages/manager/TaskUpdateList';
import AttendanceHistory from '../pages/manager/AttendanceHistory.jsx';
import AttendanceDetails from '../pages/manager/AttendanceDetails.jsx';


import StaffDetail from '../pages/details-pages/StaffDetail.jsx';
import AssignTaskDetails from '../pages/details-pages/AssignTaskDetails';
import YourTaskDetails from '../pages/details-pages/YourTaskDetails.jsx';

import AssignTask from '../pages/common-pages/AssignTask';
import Profile from '../pages/common-pages/Profile.jsx';
import TeamDailyUpdate from '../pages/common-pages/TeamDailyUpdate.jsx';
import YourTaskList from '../pages/common-pages/YourTaskList';
import Notification from '../pages/common-pages/Notification.jsx';
import { useFetchYourTasks } from '../utils/useFetchYourTasks.js';

export default function ManagerRoutes() {

  const { user, } = useAuth();

  const [teamLeaders, setTeamLeaders] = useState([])
  const [staffData, setStaffData] = useState([])

  const { yourTasks,  fetchTasks } = useFetchYourTasks();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/auth/registerUser`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      const users = response.data.users;
      const currentUserDepartment = user?.department; // Ensure `user` is defined and has a `department`

      const departmentUsers = users.filter(user => user.department === currentUserDepartment);

      setStaffData(departmentUsers);
      setTeamLeaders(departmentUsers.filter(user => user.jobPosition === 'Team Leader'));

    } catch (error) {
      console.error("Error fetching users!", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);



  return (
    <>
      <Routes>
        {/* Parent route with Layout component */}
        <Route path="" element={<Layout />}>
          {/* Nested routes */}
          <Route index element={<Dashboard staffData={staffData} teamLeaders={teamLeaders} />} />
          <Route path="my-staff" element={<TeamLeaders employees={staffData} />} />
          <Route path="add-new-staff" element={<AddTeamLeader fetchUsers={fetchUsers} />} />
          <Route path="your-task" element={<YourTaskList yourTasks={yourTasks} />} />
          <Route path="attendance-chart" element={<AttendanceChart staffData={staffData} />} />
          <Route path="attendance-histroy" element={<AttendanceHistory staffData={staffData} />} />
          <Route path="assign-task" element={<AssignTask staffData={staffData} />} />
          <Route path="task-update" element={<TaskUpdateList />} />
          <Route path="staffDeatils/:slug" element={<StaffDetail />} />
          <Route path="assignTaskDetails/:slug" element={<AssignTaskDetails />} />
          <Route path="yourTaskDetails/:slug" element={<YourTaskDetails fetchTasks={fetchTasks} />} />
          <Route path="attendance-history/:staffId" element={<AttendanceDetails />} />
          <Route path="profile" element={<Profile />} />
          <Route path="team-daily-update" element={<TeamDailyUpdate />} />
          <Route path="notification" element={<Notification />} />

        </Route>
      </Routes>
    </>
  )
}
