import logo from '../assets/crm-logo.png'
import { Link, useLocation } from 'react-router-dom';
import { CiGrid41 } from 'react-icons/ci';
import { TbPinnedFilled } from 'react-icons/tb';
import { LuUsers2 } from "react-icons/lu";
import { useAuth } from '../authProvider/AuthProvider';
import { AiOutlineUserAdd, } from "react-icons/ai";
import { VscTasklist } from "react-icons/vsc";
import { RiFileList2Line } from 'react-icons/ri';
import { CgGoogleTasks } from 'react-icons/cg';
import { SlCalender } from "react-icons/sl";
import { GrTasks } from "react-icons/gr";
import { FaWpforms } from "react-icons/fa6";
import { PiListPlusFill } from 'react-icons/pi';

export default function SideBar({ isOpen, toggleSidebar }) {
  const { userJobPosition } = useAuth();
  const roleBasedLinks = {
    Founder: [
      { path: '/founder', label: 'Dashboard', icon: <CiGrid41 /> },
      { path: '/founder/employees', label: 'Company Staff', icon: <LuUsers2 /> },
      { path: '/founder/add-new-staff', label: 'Add New Staff', icon: <AiOutlineUserAdd /> },
      { path: '/founder/assign-task', label: 'Assign Task', icon: <CgGoogleTasks /> },
      { path: '/founder/task-update', label: 'Task Update', icon: <VscTasklist /> },
      { path: '/founder/departement', label: 'Departement', icon: <RiFileList2Line /> },
      { path: '/founder/daily-update-list', label: 'Daily Update', icon: <FaWpforms /> },
    ],
    Manager: [
      { path: '/manager', label: 'Dashboard', icon: <CiGrid41 /> },
      { path: '/manager/my-staff', label: 'My Staff', icon: <LuUsers2 /> },
      { path: '/manager/add-new-staff', label: 'Add New Staff', icon: <AiOutlineUserAdd /> },
      { path: '/manager/attendance-chart', label: 'Attendance', icon: <SlCalender /> },
      { path: '/manager/attendance-histroy', label: 'Attendance Histroy', icon: <SlCalender /> },
      { path: '/manager/your-task', label: 'Your Task ', icon: <GrTasks /> },
      { path: '/manager/assign-task', label: 'Assign Task', icon: <CgGoogleTasks /> },
      { path: '/manager/task-update', label: 'Assign Task Update', icon: <VscTasklist /> },
      { path: '/manager/team-daily-update', label: 'Team Daily Update', icon: <FaWpforms /> },
    ],
    'Team Leader': [
      { path: '/team-leader', label: 'Dashboard', icon: <CiGrid41 /> },
      { path: '/team-leader/team-members', label: 'Team Members', icon: <LuUsers2 /> },
      { path: '/team-leader/add-new-team-members', label: 'Add Team Members', icon: <AiOutlineUserAdd /> },
      { path: '/team-leader/task-list', label: 'Your Task', icon: <GrTasks /> },
      { path: '/team-leader/assign-task', label: 'Assign Task', icon: <CgGoogleTasks /> },
      { path: '/team-leader/task-update', label: 'Assign Task Update', icon: <VscTasklist /> },
      { path: '/team-leader/daily-update-form', label: 'Daily Update Form', icon: < PiListPlusFill /> },
      { path: '/team-leader/team-daily-update', label: 'Team Daily Update', icon: <FaWpforms /> },
    ],
    Employee: [
      { path: '/employee', label: 'Dashboard', icon: <CiGrid41 /> },
      { path: '/employee/task-list', label: 'Your Task', icon: <GrTasks /> },
      { path: '/employee/daily-update-form', label: 'Daily Update Form', icon: < PiListPlusFill /> },
    ],
  }

  return (
    <>
      <div
        className={`z-30  bg-white border-r-2  transition-all duration-300 ${isOpen ? 'w-[80%] sm:w-[252px] block' : 'hidden lg:block lg:w-16'}   h-screen fixed`}
        style={{ borderColor: `linear-gradient(266deg, #a54de3 32%, #ff08e9 71%)` }}>
        <div className={` flex items-center  shadow shadow-white/5 justify-center border-b h-[4.3rem] py-1`}>
          <div className={`${!isOpen ? 'hidden' : ''}`}>
            <img src={logo} alt="logo" className='w-40' />
          </div>
          <div
            onClick={toggleSidebar}
            className={`group p-2 bg-gradiant rounded-md cursor-pointer  ${!isOpen ? 'flex' : 'hidden'}`} >
            <span className={`text-2xl font-semibold text-white  group-hover:rotate-180 transform duration-500`}>
              <CiGrid41 />
            </span>
          </div>
        </div>

        <div className={`mt-10 flex flex-col  ${isOpen ? ' px-3 gap-y-1' : 'px-3 gap-y-3'}`}>
          {roleBasedLinks[userJobPosition]?.map((link) => (
            <MenuItem URL={link.path} icon={link.icon} label={link.label} isOpen={isOpen} key={link.path} />
          ))}
        </div>
      </div>
    </>
  )
}

const MenuItem = ({ URL, icon, label, isOpen }) => {
  const location = useLocation();
  const isActive = location.pathname === URL;

  return (
    <Link
      to={URL}
      className={`flex items-center group 
        ${!isOpen ? 'justify-center py-2' : 'py-2 px-3 justify-between'} 
        ${isActive ? 'bg-gradiant text-white rounded-md' : 'text-gray-600 hover:text-purple-500'}
      `}
    >
      <div className='flex items-center'>
        <span className={`text-xl font-bold ${!isOpen ? 'hidden lg:flex' : ''} duration-600`}>
          {icon}
        </span>
        {isOpen && <span className="ml-3 text-base">{label}</span>}
      </div>
      {isOpen && (
        <span className="hidden group-hover:flex duration-300 text-lg">
          <TbPinnedFilled />
        </span>
      )}
    </Link>
  );
};