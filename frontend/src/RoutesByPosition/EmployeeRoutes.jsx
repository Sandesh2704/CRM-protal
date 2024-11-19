import { Route, Routes } from 'react-router-dom';

import Layout from '../layout/Layout';
import Dashboard from '../pages/employ/Dashboard';
import DailyUpdateFrom from '../pages/DailyUpdateFrom';
import YourTaskDetails from '../pages/YourTaskDetails';
import YourTaskList from '../pages/teamLeader/YourTaskList';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../authProvider/AuthProvider';
import Profile from '../pages/Profile';

export default function EmployeeRoutes() {
  const { user, token } = useAuth();
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
        <Route path="/" element={<Layout />}>
          {/* Nested routes */}
          <Route index element={<Dashboard  yourTasks={yourTasks}  yourPendingTasks={yourPendingTasks}/>} />
          <Route path="daily-update-form" element={<DailyUpdateFrom />} />  
          <Route path="task-list" element={<YourTaskList yourTasks={yourTasks}/>} />
          <Route path="yourTaskDetails/:slug" element={<YourTaskDetails fetchTasks={fetchTasks}/>} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  )
}