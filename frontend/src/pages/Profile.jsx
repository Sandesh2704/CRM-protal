import React from 'react';
import { useAuth } from '../authProvider/AuthProvider';
import Button from '../component/Button';
import ProfileField from '../component/ProfileField';
import PageHeader from '../component/PageHeader';
import { FaUserLarge } from "react-icons/fa6";

export default function Profile() {
  const { user } = useAuth();

  return (

    <>


      <div>
        <PageHeader title='Your Profile' icon={<FaUserLarge />} />
      </div>

      <div className='relative bg-white shadow rounded-lg pb-6'>
        <div className='z-0 absolute rounded-t-lg w-full top-0  bg-gradiant h-36 xl:h-44 ' />

        <div className='relative px-4  lg:px-7 grid grid-cols-12  z-10 flex flex-col md:flex-row justify-start  gap-7 '>
          <div className='pt-6 lg:pb-6 h-fit col-span-12 lg:col-span-5 xl:col-span-4 flex justify-center'>
            <img src={`${process.env.REACT_APP_DOMAIN_URL}/${user.profileIMG}`} alt={user.username} className='w-96 h-96 rounded-lg  transition-all duration-500 hover:filter hover:grayscale-[80%] hover:brightness-[90%]' />
          </div>


          <div className='flex flex-col col-span-12 lg:col-span-7 xl:col-span-8'>
            <div className='w-full flex items-center text-black  lg:text-white lg:h-36 xl:h-44 '>
              <div >
                <h2 className="text-3xl md:text-5xl xl:text-6xl font-semibold italic">{user.username}</h2>
                <p className="text-base md:text-lg xl:text-xl mt-3">{user.jobPosition}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg::grid-cols-2 xl:grid-cols-3 py-6 gap-x-7 gap-y-6">
              <ProfileField label="Department" value={user.department} />
              {user.jobRole && <ProfileField label="Job Role" value={user.jobRole} />}
              <ProfileField label="Phone" value={user.number} />
              <ProfileField label="Joined" value={new Date(user.joiningDate).toLocaleDateString()} />
              <ProfileField label="City" value={user.city} />
              <ProfileField label="State" value={user.state} />
              <ProfileField label="Gender" value={user.gender} />
              <ProfileField label="Email" value={user.email} />
            </div>
          </div>
        </div>
        <div className='mt-5 flex justify-center'>
          <Button title='Update' />
        </div>
      </div>
    </>
  );
}