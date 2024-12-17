import { useState } from 'react'
import { MdOutlineZoomInMap } from "react-icons/md";
import { CiGrid41 } from 'react-icons/ci';
import { TbZoomInAreaFilled } from "react-icons/tb";
import { useAuth } from '../authProvider/AuthProvider';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/crm-logo.png'
import fakeimage from "../assets/fake-img2.webp"
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaBell } from 'react-icons/fa6';
import { useFetchNotification } from '../utils/useFetchNotification';

export default function Navbar({ toggleSidebar, isOpen }) {
  const { user } = useAuth();
  const { notifications, handleMarkRead, unreadCount } = useFetchNotification() 
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Manage dropdown visibility
  const [showDropdown, setShowDropdown] = useState(false);


  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  const handleToggle = () => {
    setIsDropdownOpen(prevState => !prevState); // Toggle dropdown visibility
  };


  return (
    <>
      <div className={`relative z-20 h-[4.3rem] py-1 px-4 lg:px-6  border-b  flex items-center justify-between bg-white  top-0 left-0 `}>
        <button
          onClick={toggleSidebar}
          className={`group p-2 bg-gradiant text-white  rounded-md cursor-pointer ${!isOpen ? 'flex lg:hidden' : 'flex'}`} >
          <span className={`text-2xl font-semibold  group-hover:rotate-180 transform duration-500`}>
            <CiGrid41 />
          </span>
        </button>

        <div className={`${!isOpen ? 'flex' : 'hidden'} `}>
          <img src={logo} alt="logo" className='w-40' />
        </div>

        <div className='flex items-center gap-5 '>

          <button
            className="relative flex items-center"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className='text-gray-500'> <FaBell size={24} /></span>

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[7px] rounded-full px-1 py-[2px]">
                {unreadCount}
              </span>
            )}
          </button>

          <div className='relative'>
            <button onClick={toggleFullscreen} className="p-3 bg-purple-200/40  rounded-full hidden lg:flex">
              {
                isFullscreen ? <MdOutlineZoomInMap className="text-lg" /> : <TbZoomInAreaFilled className="text-xl" />
              }
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-6 w-72 bg-white shadow-lg shadow-black/5 rounded-lg">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-semibold">Notifications</h3>
                  <button
                    className="text-blue-500 text-sm"
                    onClick={handleMarkRead}
                  >
                    Mark all as read
                  </button>
                </div>
                <ul className="max-h-60 overflow-auto">
                  {notifications.slice(0, 3).map(notification => (
                    <li
                      key={notification._id}
                      className={`p-4 border-b ${notification.read ? 'bg-gray-100' : 'bg-white'}`}
                    >
                      <p className="text-sm">{notification.message}</p>
                      <span className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
                <div className="p-4 text-center">
                  <Link
                    to="/notifications"
                    className="text-blue-500 text-sm"
                    onClick={() => setShowDropdown(false)}
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}

          </div>
          <div className='relative'>
            <div className='flex items-center gap-2 cursor-pointer' onClick={handleToggle}>
              <div className="rounded-full focus:outline-none focus:ring">
                <img src={user.profileIMG ? `${process.env.REACT_APP_DOMAIN_URL}/${user.profileIMG}` : fakeimage} alt={user.username || 'Unavailable'} className="h-9 lg:h-11 w-9 lg:w-11 rounded-full" />
              </div>
              <div className="hidden xl:flex flex-col">
                <h2 className="text-lg text-black">{user.username || 'Unavailable'}</h2>
                <span className="text-xs text-[#787878]" style={{ marginBottom: 0 }}>{user.jobPosition || 'Unavailable'}</span>
              </div>
              {/* Down Arrow Icon */}
              <span className={`text-2xl ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}><RiArrowDropDownLine /> </span>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className='absolute bg-white mt-6 right-0 w-32 shadow-lg shadow-black/5 rounded-lg'>
                <p className='py-2 px-4 mb-0 border-b w-full cursor-pointer' onClick={handleToggle}>
                  <NavLink to='/logout'>Logout</NavLink>
                </p>
                <p className='py-2 px-4 mb-0 w-full cursor-pointer' onClick={handleToggle}>
                  <NavLink to='profile'>Profile</NavLink>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
