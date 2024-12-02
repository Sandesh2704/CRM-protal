import { Route, Routes, } from 'react-router-dom';
import Dashboard from '../pages/manager/Dashboard';
import Layout from '../layout/Layout';
import TeamLeaders from '../pages/manager/TeamLeaders';
import AddTeamLeader from '../pages/manager/AddTeamLeader';
import AttendanceChart from '../pages/manager/AttendanceChart';
import YourTaskList from '../pages/manager/YourTaskList'
import { useAuth } from '../authProvider/AuthProvider.js';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AssignTask from '../pages/AssignTask.jsx';
import TaskUpdateList from '../pages/manager/TaskUpdateList';
import StaffDetail from '../pages/StaffDetail';
import AssignTaskDetails from '../pages/AssignTaskDetails.jsx';
import YourTaskDetails from '../pages/YourTaskDetails.jsx';
import Profile from '../pages/Profile.jsx';
import TeamDailyUpdate from '../pages/TeamDailyUpdate.jsx';
import AttendanceHistory from '../pages/manager/AttendanceHistory.jsx';
import AttendanceDetails from '../pages/manager/AttendanceDetails.jsx';

export default function ManagerRoutes() {

  const { user } = useAuth();
 
  const [ teamLeaders, setTeamLeaders  ] =useState([])
  const [ staffData, setStaffData] = useState([])



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
          <Route index element={<Dashboard staffData={staffData} teamLeaders={teamLeaders}/>} />
          <Route path="my-staff" element={<TeamLeaders employees ={staffData}/>} />
          <Route path="add-new-staff" element={<AddTeamLeader fetchUsers={fetchUsers}/>} />                
          <Route path="your-task" element={<YourTaskList/>} />
          <Route path="attendance-chart" element={<AttendanceChart staffData={staffData}/>} />
          <Route path="attendance-histroy" element={<AttendanceHistory staffData={staffData}/>} />
          <Route path="assign-task" element={<AssignTask staffData={staffData} />} />
          <Route path="task-update" element={<TaskUpdateList />} />
          <Route path="staffDeatils/:slug" element={<StaffDetail/>} />
          <Route path="assignTaskDetails/:slug" element={<AssignTaskDetails/>} />
          <Route path="yourTaskDeatils/:slug" element={<YourTaskDetails/>} />
          <Route path="attendance-history/:staffId" element={<AttendanceDetails/>} />
          <Route path="profile" element={<Profile />} />
          <Route path="team-daily-update" element={<TeamDailyUpdate/>} />  
        </Route>
      </Routes>
    </>
  )
}



  // const [ myStaffData, setMyStaffData] = useState([])
  // useEffect(() => {
  //   const fetchteamLeadersList = async () => {
  //     if (parentId) {
  //       try {
  //         console.log('Fetching team members for:', parentId);
  //         const response = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/userManage/user/${parentId}`);
  //         console.log('Team members fetched:', response.data);

  //         const users = response.data.users;
  //         setStaffData(users);
  //       } catch (error) {
  //         console.error('Failed to load team members:', error.response?.data || error.message);
  //       }
  //     } else {
  //       console.log("No team leader ID available");
  //     }
  //   };
  //   fetchteamLeadersList();
  // }, [parentId]);