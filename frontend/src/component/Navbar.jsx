import { useState } from 'react'
import { MdOutlineZoomInMap } from "react-icons/md";
import { CiGrid41 } from 'react-icons/ci';
import { TbZoomInAreaFilled } from "react-icons/tb";
import { useAuth } from '../authProvider/AuthProvider';
import { NavLink } from 'react-router-dom';
import man from '../assets/man.png'
import logo from '../assets/crm-logo.png'

export default function Navbar({ toggleSidebar, isOpen }) {
  const { user } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  return (
    <>
      <div className={`relative z-10 h-[4.3rem] py-1 px-4 lg:px-6  border-b  flex items-center justify-between bg-white  fixed sticky top-0 left-0 `}>
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
          <button onClick={toggleFullscreen} className="bg-blue-200/50 rounded-full p-3 hidden lg:flex">
            {
              isFullscreen ? <MdOutlineZoomInMap className="text-lg" /> : <TbZoomInAreaFilled className="text-xl" />
            }
          </button>
          <div className='relative group'>
            <div className='flex items-center gap-2 '>
              <div className="rounded-full focus:outline-none focus:ring">
                <img src={`${process.env.REACT_APP_DOMAIN_URL}/${user.profileIMG}` || man} alt={user.username || 'Unavailable'} className="w-9 lg:w-10  rounded-full" />
              </div>
              <div className=" hidden xl:flex flex-col">
                <h2 className="text-lg  text-black">{user.username || 'Unavailable'} </h2>
                <span className="text-xs text-[#787878]" style={{ marginBottom: 0 }}>{user.jobPosition || 'Unavailable'} </span>
              </div>
            </div>
            <div className='absolute  bg-white mt-6  right-0  w-32 shadow-lg shadow-black/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity'>
              <p className='py-2 px-4 mb-0 border-b w-full cursor-pointer'><NavLink to='/logout'>Logout </NavLink></p>
              <p className='py-2 px-4 mb-0  w-full cursor-pointer'><NavLink to='profile'>  Profile</NavLink></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}