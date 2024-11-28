import { Route, Routes, } from 'react-router-dom';
import Dashboard from '../pages/teamLeader/Dashboard';
import Profile from '../pages/Profile';
import TeamMember from '../pages/teamLeader/TeamMember';
import Layout from '../layout/Layout';
import AssignTask from '../pages/AssignTask';
import YourTaskList from '../pages/teamLeader/YourTaskList';
import TaskUpdateList from '../pages/teamLeader/TaskUpdateList';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../authProvider/AuthProvider';
import AddTeamMember from '../pages/teamLeader/AddTeamMember';
import StaffDetail from '../pages/StaffDetail';
import AssignTaskDetails from '../pages/AssignTaskDetails';
import DailyUpdateFrom from '../pages/DailyUpdateFrom';
import YourTaskDetails from '../pages/YourTaskDetails';
import TeamDailyUpdate from '../pages/TeamDailyUpdate';

export default function TeamLeaderRoutes() {

  const { user, token } = useAuth();
  const parentId = user?._id;
  const [staffData, setStaffData] = useState([])
  useEffect(() => {
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
    fetchteamLeadersList();
  }, [parentId]);


  const [yourTasks, setYourTasks] = useState([]);
  const [yourPendingTasks, setYourPendingTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      console.log("Fetching tasks for user:", user._id);
      const response = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/taskManage/get-assign-task/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Tasks fetched:", response.data);

      // Set all tasks
      const tasks = response.data;
      setYourTasks(tasks);

      // Filter tasks with status "Pending"
      const pendingTasks = tasks.filter((task) => task.status === "Pending");
      setYourPendingTasks(pendingTasks);

    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };




  useEffect(() => {
    if (user._id) {
      fetchTasks();
    }
    fetchTasks();
  }, [user, token]);

  return (
    <>
      <Routes>
        {/* Parent route with Layout component */}
        <Route path="" element={<Layout />}>
          {/* Nested routes */}
          <Route index element={<Dashboard staffData={staffData} yourTasks={yourTasks} yourPendingTasks={yourPendingTasks} />} />
          <Route path="profile" element={<Profile />} />
          <Route path="team-members" element={<TeamMember staffData={staffData} />} />
          <Route path="add-new-team-members" element={<AddTeamMember />} />
          <Route path="task-list" element={<YourTaskList yourTasks={yourTasks} />} />
          <Route path="assign-task" element={<AssignTask staffData={staffData} />} />
          <Route path="task-update" element={<TaskUpdateList />} />
          <Route path="daily-update-form" element={<DailyUpdateFrom />} />
          <Route path="team-daily-update" element={<TeamDailyUpdate />} />
          <Route path="staffDeatils/:slug" element={<StaffDetail />} />
          <Route path="assignTaskDetails/:slug" element={<AssignTaskDetails />} />
          <Route path="yourTaskDetails/:slug" element={<YourTaskDetails fetchTasks={fetchTasks} />} />
        </Route>
      </Routes>
    </>
  )
}