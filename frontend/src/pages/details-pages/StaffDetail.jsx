import React from 'react'
import fakeimage from "../../assets/fake-img2.webp"
import { useLocation } from 'react-router-dom';
import ProfileField from '../../component/ProfileField';
export default function StaffDetail() {

  const location = useLocation();
  const staffDetails = location.state?.memberDetails;
  if (!staffDetails) {
    return <div>No member details available.</div>;
  }

  const { profileIMG, username, email, number, department, jobPosition, jobRole, city, state, gender, joiningDate, dateOfBirth } = staffDetails;
  return (
    <>
      <div className='w-full bg-white shadow rounded-lg mt-7'>

        <div className='relative '>
          <div className='z-0 absolute rounded-t-lg w-full top-0  bg-gradiant h-36 xl:h-44' />


          <div className='relative px-4  lg:px-7 grid grid-cols-12  z-10 flex flex-col md:flex-row justify-start  gap-7 '>
            <div className='pt-6 lg:pb-6 h-fit col-span-12 lg:col-span-5 xl:col-span-4 flex justify-center'>
              <img
                src={profileIMG ? `${process.env.REACT_APP_DOMAIN_URL}/${profileIMG}` : fakeimage}
                alt={username} className='w-96 h-96 rounded-lg  transition-all duration-500 hover:filter hover:grayscale-[80%] hover:brightness-[90%]' />
            </div>


            <div className='flex flex-col col-span-12 lg:col-span-7 xl:col-span-8'>
              <div className='w-full flex items-center text-black  lg:text-white lg:h-36 xl:h-44 '>
                <div >
                  <h2 className="text-3xl md:text-5xl xl:text-6xl font-semibold italic">{username}</h2>
                  <p className="text-base md:text-lg xl:text-xl mt-3">{jobPosition}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg::grid-cols-2 xl:grid-cols-3 py-6 gap-x-7 gap-y-6">
                <ProfileField label="Department" value={department} />
                {jobRole && <ProfileField label="Job Role" value={jobRole} />}
                <ProfileField label="Phone" value={number} />
                <ProfileField label="Joined" value={new Date(joiningDate).toLocaleDateString()} />
                <ProfileField label="City" value={city} />
                <ProfileField label="State" value={state} />
                <ProfileField label="Gender" value={gender} />
                <ProfileField label="Date Of Birth" value={dateOfBirth} />
                <ProfileField label="Email" value={email} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}