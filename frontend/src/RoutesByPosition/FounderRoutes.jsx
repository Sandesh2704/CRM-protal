import { Route, Routes, } from 'react-router-dom';
import Dashboard from '../pages/founder/Dashboard';
import Profile from '../pages/Profile';
import Layout from '../layout/Layout';
import AllEmployes from '../pages/founder/AllEmployes';
import AddNewManager from '../pages/founder/AddNewManager';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Department from '../pages/founder/Department';
import StaffDetail from '../pages/StaffDetail';
import AssignTask from '../pages/AssignTask';
import TaskUpdateList from '../pages/founder/TaskUpdateList';
import AssignTaskDetails from '../pages/AssignTaskDetails';
import DailyUpdateList from '../pages/founder/DailyUpdateList';


export default function FounderRoutes() {

  const [managers, setManagers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);

  useEffect(() => {
    fetchUsers();
    getDepartments();
  }, []);

  // Fetch users to get managers and employees
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/auth/registerUser`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      const users = response.data.users;
      setEmployees(users);
      setManagers(users.filter(user => user.jobPosition === 'Manager'));
    } catch (error) {
      console.error("Error fetching users!", error);
    }
  };

  // Fetch departments
  const getDepartments = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/departementManage/get-department`);
      setDepartmentData(response.data);
    } catch (error) {
      console.error("Error fetching departments!", error);
    }
  };

  return (
    <>
      <Routes>
        {/* Parent route with Layout component */}
        <Route path="/" element={<Layout />}>
          {/* Nested routes */}
          <Route index element={<Dashboard managers={managers} employees={employees} />} />
          <Route path="profile" element={<Profile />} />
          <Route path="employees" element={<AllEmployes employees={employees} />} />
          <Route path="add-new-staff" element={<AddNewManager departmentData={departmentData} fetchUsers={fetchUsers} />} />
          <Route path="assign-task" element={<AssignTask staff={managers} />} />
          <Route path="task-update" element={<TaskUpdateList />} />
          <Route path="departement" element={<Department departmentData={departmentData} getDepartments={getDepartments} />} />
          <Route path="staffDeatils/:slug" element={<StaffDetail/>} />
          <Route path="assignTaskDetails/:slug" element={<AssignTaskDetails/>} />
          <Route path="daily-update-list" element={<DailyUpdateList/>} />
        </Route>
      </Routes>
    </>
  )
}
