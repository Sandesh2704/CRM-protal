import { Route, Routes, } from 'react-router-dom';
import Dashboard from '../pages/teamLeader/Dashboard';
import Profile from '../pages/Profile';
import TeamMember from '../pages/teamLeader/TeamMember';
import Layout from '../layout/Layout';
import AssignTask from '../pages/AssignTask';
import TaskList from '../pages/manager/TaskList';
import TaskUpdateList from '../pages/teamLeader/TaskUpdateList';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../authProvider/AuthProvider';
import AddTeamMember from '../pages/teamLeader/AddTeamMember';
import StaffDetail from '../pages/StaffDetail';
import AssignTaskDetails from '../pages/AssignTaskDetails';
import DailyUpdateFrom from '../pages/DailyUpdateFrom';
import TeamDailyUpdate from '../pages/teamLeader/TeamDailyUpdate';

export default function TeamLeaderRoutes() {

  const { user } = useAuth();
  const parentId = user?._id;
  const [ staffData, setStaffData] = useState([])
  useEffect(() => {
    const fetchteamLeadersList = async () => {
      if (parentId) {
        try {
          console.log('Fetching team members for:', parentId);
          const response = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/userManage/user/${parentId}`);
          console.log('Team members fetched:', response.data);

          // Update this line to set the teamLeadersList correctly
         
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
 
  return (
    <>
      <Routes>
        {/* Parent route with Layout component */}
        <Route path="/" element={<Layout />}>
          {/* Nested routes */}
          <Route index element={<Dashboard staffData={staffData}/>} />
          <Route path="profile" element={<Profile />} />
          <Route path="team-members" element={<TeamMember staffData={staffData}/>} />
          <Route path="add-new-team-members" element={<AddTeamMember />} />  
          <Route path="task-list" element={<TaskList/>} />
          <Route path="assign-task" element={<AssignTask staff={staffData} />} />
          
          <Route path="task-update" element={<TaskUpdateList />} />          
          <Route path="daily-update-form" element={<DailyUpdateFrom />} />  
          <Route path="team-daily-update" element={<TeamDailyUpdate/>} />  
          <Route path="staffDeatils/:slug" element={<StaffDetail/>} />
          <Route path="assignTaskDetails/:slug" element={<AssignTaskDetails/>} />
        </Route>
      </Routes>
    </>
  )
}