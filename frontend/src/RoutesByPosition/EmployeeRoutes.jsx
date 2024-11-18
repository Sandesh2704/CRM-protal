import { Route, Routes } from 'react-router-dom';

import Layout from '../layout/Layout';
import Dashboard from '../pages/employ/Dashboard';
import DailyUpdateFrom from '../pages/DailyUpdateFrom';

export default function EmployeeRoutes() {
  return (
    <>
      <Routes>
        {/* Parent route with Layout component */}
        <Route path="/" element={<Layout />}>
          {/* Nested routes */}
          <Route index element={<Dashboard />} />
          <Route path="daily-update-form" element={<DailyUpdateFrom />} />  
        </Route>
      </Routes>
    </>
  )
}