import { Route, Routes } from 'react-router-dom';

import Layout from '../layout/Layout';
import Dashboard from '../pages/teamLeader/Dashboard';
import Profile from '../pages/Profile';
import TeamMember from '../pages/teamLeader/TeamMember';
import AddTeamMember from '../pages/teamLeader/AddTeamMember';


export default function EmployeeRoutes() {
  return (
    <>
      <Routes>
        {/* Parent route with Layout component */}
        <Route path="/" element={<Layout />}>
          {/* Nested routes */}
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="team-members" element={<TeamMember />} />
          <Route path="add-team-member" element={<AddTeamMember />} />
        </Route>
      </Routes>
    </>
  )
}