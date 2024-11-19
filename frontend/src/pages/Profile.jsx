
// import React, { useState } from 'react';
// import { useAuth } from '../authProvider/AuthProvider';
// import Button from '../component/Button';
// import ProfileField from '../component/ProfileField';
// import PageHeader from '../component/PageHeader';
// import { FaUserLarge } from "react-icons/fa6";
// import TextInput from '../component/TextInput';
// import { MdClose } from 'react-icons/md';
// import { IoCloudUploadOutline } from 'react-icons/io5';
// import { IoCloseSharp } from "react-icons/io5"
// import axios from 'axios';

// export default function Profile() {
//   // const { user, userAuthentication } = useAuth();
//   // const [isModalOpen, setIsModalOpen] = useState(false);
//   // const [previewSrc, setPreviewSrc] = useState('');
//   // const [updatedData, setUpdatedData] = useState({
//   //   username: user.username,
//   //   jobPosition: user.jobPosition,
//   //   department: user.department,
//   //   jobRole: user.jobRole,
//   //   number: user.number,
//   //   city: user.city,
//   //   state: user.state,
//   //   gender: user.gender,
//   //   email: user.email,
//   //   joiningDate: user.joiningDate,
//   // });

//   const { user, userAuthentication } = useAuth();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [previewSrc, setPreviewSrc] = useState(user.profileIMG || ""); // Show existing profile image
//   const [updatedData, setUpdatedData] = useState({
//     username: user.username,
//     jobPosition: user.jobPosition,
//     department: user.department,
//     jobRole: user.jobRole,
//     number: user.number,
//     city: user.city,
//     state: user.state,
//     gender: user.gender,
//     email: user.email,
//     joiningDate: user.joiningDate,
//     profileIMG: null, // Track new uploaded image
//   });

//   const inputHandler = (e) => {
//     const { name, value, files } = e.target;
//     setUpdatedData((prev) => ({
//       ...prev,
//       [name]: files?.[0] || value,
//     }));

//     if (name === 'profileIMG' && files?.[0]) {
//       const reader = new FileReader();
//       reader.onload = () => setPreviewSrc(reader.result);
//       reader.readAsDataURL(files[0]);
//     }
//   };

//   const deleteImage = (e) => {
//     e.preventDefault(); // Prevent unintended form submission
//     setUpdatedData((prev) => ({ ...prev, profileIMG: null })); // Remove image from form data
//     setPreviewSrc(""); // Clear the preview
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();

//     for (const key in updatedData) {
//       if (updatedData[key] !== null && updatedData[key] !== undefined) {
//         formData.append(key, updatedData[key]);
//       }
//     }

//     try {
//       console.log("Submitting data to backend:", updatedData); // Log updatedData
//       const response = await axios.put(
//         `${process.env.REACT_APP_DOMAIN_URL}/userManage/edit/${user._id}`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       console.log("Response from backend:", response.data);
//       if (response.status === 200) {
//         alert('Profile updated successfully!');
//         setIsModalOpen(false);
//         // Refetch user data to get the updated user info
//         await userAuthentication(); // Ensure user data is re-fetched
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//     }
//   };

//   return (
//     <>
//       <div>
//         <PageHeader title="Your Profile" icon={<FaUserLarge />} />
//       </div>

//       <div className='relative bg-white shadow rounded-lg pb-6'>
//         <div className='z-0 absolute rounded-t-lg w-full top-0  bg-gradiant h-36 xl:h-44 ' />

//         <div className='relative px-4  lg:px-7 grid grid-cols-12  z-10 flex flex-col md:flex-row justify-start  gap-7 '>
//           <div className='pt-6 lg:pb-6 h-fit col-span-12 lg:col-span-5 xl:col-span-4 flex justify-center'>
//             <img src={`${process.env.REACT_APP_DOMAIN_URL}/${user.profileIMG}`} alt={user.username} className='w-96 h-96 rounded-lg  transition-all duration-500 hover:filter hover:grayscale-[80%] hover:brightness-[90%]' />
//           </div>


//           <div className='flex flex-col col-span-12 lg:col-span-7 xl:col-span-8'>
//             <div className='w-full flex items-center text-black  lg:text-white lg:h-36 xl:h-44 '>
//               <div >
//                 <h2 className="text-3xl md:text-5xl xl:text-6xl font-semibold italic">{user.username}</h2>
//                 <p className="text-base md:text-lg xl:text-xl mt-3">{user.jobPosition}</p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg::grid-cols-2 xl:grid-cols-3 py-6 gap-x-7 gap-y-6">
//               <ProfileField label="Department" value={user.department} />
//               {user.jobRole && <ProfileField label="Job Role" value={user.jobRole} />}
//               <ProfileField label="Phone" value={user.number} />
//               <ProfileField label="Joined" value={new Date(user.joiningDate).toLocaleDateString()} />
//               <ProfileField label="City" value={user.city} />
//               <ProfileField label="State" value={user.state} />
//               <ProfileField label="Gender" value={user.gender} />
//               <ProfileField label="Email" value={user.email} />
//             </div>
//           </div>
//         </div>
//         <div className='mt-5 flex justify-center'>
//           <button onClick={() => setIsModalOpen(true)}>
//             <Button title='Update' />
//           </button>

//         </div>
//       </div>

//       {isModalOpen && (
//         <div className="absolute inset-0 z-40 flex justify-center  bg-gray-800 ">
//           <div className='mt-7'>



//             <div className='flex justify-between  gap-4 my-7 bg-white py-4 px-4 rounded-lg shadow shadow-black/5'>
//               <div className='flex gap-3 items-center'>
//                 <div className={`group p-2 bg-gradiant text-xl text-white  rounded-md cursor-pointer`} >
//                   <FaUserLarge />
//                 </div>
//                 <h1 className='font-medium text-xl'>Update Profile</h1>
//               </div>
// <button onClick={() => setIsModalOpen(false)}  className='p-2 rounded bg-gradiant text-white text-2xl flex items-center  bg-red-900'>
// <IoCloseSharp/>
// </button>
//             </div>

//             <div className="bg-white rounded-lg relative px-6 py-7 ">
//               <form onSubmit={handleSubmit}>
//                 <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3   gap-x-7 gap-y-10'>
//                   {/* <div className='w-full md:row-span-2 lg:row-span-2'>
//                     {updatedData.profileIMG ? (
//                       <div className='relative flex justify-center'>
//                         <img src={`${process.env.REACT_APP_DOMAIN_URL}/${previewSrc}`} alt='Profile' className='min-w-64 min-h-60 max-h-60 max-w-64  rounded-lg w-auto' />
//                         <button
//                           className='absolute right-3 top-2 text-black bg-blue-100 rounded p-1'
//                           onClick={deleteImage}
//                         >
//                           <MdClose />
//                         </button>
//                       </div>
//                     ) : (
//                       <div className='h-60  flex items-center rounded-lg justify-center border border-gray-400 border-dashed cursor-pointer'>
//                         <label className='flex flex-col items-center justify-center'>
//                           <IoCloudUploadOutline className='text-5xl text-gray-400 mb-5' />
//                           <p className='text-gray-600 text-center'>
//                             <span className='font-semibold text-black'>Click to upload profile image</span><br />
//                             or drag and drop
//                           </p>
//                           <input
//                             type='file'
//                             name='profileIMG'
//                             className='hidden'
//                             onChange={inputHandler}
//                           />
//                         </label>
//                       </div>
//                     )}
//                   </div> */}

// <div className="w-full md:row-span-2 lg:row-span-2">
//                     {previewSrc || user.profileIMG ? (
//                       <div className="relative flex justify-center">
//                         <img
//                           src={`${process.env.REACT_APP_DOMAIN_URL}/${previewSrc || user.profileIMG}`}
//                           alt="Profile"
//                           className="min-w-64 min-h-60 max-h-60 max-w-64 rounded-lg w-auto"
//                         />
//                         <button
//                           className="absolute right-3 top-2 text-black bg-blue-100 rounded p-1"
//                           onClick={deleteImage}
//                         >
//                           <MdClose />
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="h-60 flex items-center rounded-lg justify-center border border-gray-400 border-dashed cursor-pointer">
//                         <label className="flex flex-col items-center justify-center">
//                           <IoCloudUploadOutline className="text-5xl text-gray-400 mb-5" />
//                           <p className="text-gray-600 text-center">
//                             <span className="font-semibold text-black">
//                               Click to upload profile image
//                             </span>
//                             <br />
//                             or drag and drop
//                           </p>
//                           <input
//                             type="file"
//                             name="profileIMG"
//                             className="hidden"
//                             onChange={inputHandler}
//                           />
//                         </label>
//                       </div>
//                     )}
//                   </div>

//                   <TextInput
//                     label="Username"
//                     name="username"
//                     value={updatedData.username}
//                     inputHandler={inputHandler}
//                     placeholder="Enter your username"
//                   />

//                   <TextInput
//                     label="Phone"
//                     name="number"
//                     value={updatedData.number}
//                     inputHandler={inputHandler}
//                     placeholder="Enter your phone number"
//                   />

//                   <TextInput
//                     label="City"
//                     name="city"
//                     value={updatedData.city}
//                     inputHandler={inputHandler}
//                     placeholder="Enter your city"
//                   />
//                   <TextInput
//                     label="State"
//                     name="state"
//                     value={updatedData.state}
//                     inputHandler={inputHandler}
//                     placeholder="Enter your state"
//                   />


//                   <div>
//                     <label className='font-medium'>Gender:</label>
//                     <div className='flex gap-5 py-4 px-6 mt-2'>
//                       <div className='flex items-center gap-2'>
//                         <input type="radio" name="gender" value={updatedData.gender} checked={updatedData.gender === 'male'} onChange={inputHandler} />
//                         <label>Male</label>
//                       </div>
//                       <div className='flex items-center gap-2'>
//                         <input type="radio" name="gender" value={updatedData.gender} checked={updatedData.gender === 'female'} onChange={inputHandler} />
//                         <label>Female</label>
//                       </div>
//                     </div>
//                   </div>


//                   <TextInput
//                     type="date"
//                     label="Joining Date"
//                     name="joiningDate"
//                     value={updatedData.joiningDate}
//                     inputHandler={inputHandler}
//                     placeholder="Enter your gender"
//                   />

//                 </div>


//                 <div className="mt-7 flex justify-end gap-4">
//                   <button onClick={() => setIsModalOpen(false)} >
//                     <Button title="Cancel" />
//                   </button >

//                   <button onClick={handleSubmit} >
//                     <Button title="Update" />
//                   </button>
//                 </div>
//               </form>

//             </div>

//           </div>

//         </div>
//       )}
//     </>
//   );
// }


import React, { useState } from "react";
import { useAuth } from "../authProvider/AuthProvider";
import Button from "../component/Button";
import ProfileField from "../component/ProfileField";
import PageHeader from "../component/PageHeader";
import { FaUserLarge } from "react-icons/fa6";
import TextInput from "../component/TextInput";
import { MdClose } from "react-icons/md";
import { IoCloudUploadOutline } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";

export default function Profile() {
  const { user, userAuthentication } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(user.profileIMG || ""); // Show existing profile image
  const [updatedData, setUpdatedData] = useState({
    username: user.username,
    jobPosition: user.jobPosition,
    department: user.department,
    jobRole: user.jobRole,
    number: user.number,
    city: user.city,
    state: user.state,
    gender: user.gender,
    email: user.email,
    joiningDate: user.joiningDate,
    profileIMG: null, // Track new uploaded image
  });

  const inputHandler = (e) => {
    const { name, value, files } = e.target;

    setUpdatedData((prev) => ({
      ...prev,
      [name]: files?.[0] || value,
    }));

    if (name === "profileIMG" && files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => setPreviewSrc(reader.result); // Show uploaded image
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    for (const key in updatedData) {
      if (updatedData[key] !== null && updatedData[key] !== undefined) {
        formData.append(key, updatedData[key]);
      }
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_DOMAIN_URL}/userManage/edit/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Profile updated successfully!"); // Show success message here
        setIsModalOpen(false);
        await userAuthentication(); // Refetch user data
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const deleteImage = (e) => {
    e.preventDefault(); // Prevent unintended form submission
    setUpdatedData((prev) => ({ ...prev, profileIMG: null })); // Remove image from form data
    setPreviewSrc(""); // Clear the preview
  };

  return (
    <>
      <div>
        <PageHeader title="Your Profile" icon={<FaUserLarge />} />
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
          <button onClick={() => setIsModalOpen(true)}>
            <Button title='Update' />
          </button>

        </div>
      </div>

      {isModalOpen && (
        <div className="absolute inset-0 z-40 flex justify-center bg-gray-800 bg-opacity-40">
          <div className="mt-7">



            <div className='flex justify-between  gap-4 my-7 bg-white py-4 px-4 rounded-lg shadow shadow-black/5'>
              <div className='flex gap-3 items-center'>
                <div className={`group p-2 bg-gradiant text-xl text-white  rounded-md cursor-pointer`} >
                  <FaUserLarge />
                </div>
                <h1 className='font-medium text-xl'>Update Profile</h1>
              </div>
              <button onClick={() => setIsModalOpen(false)} className='p-2 rounded bg-gradiant text-white text-2xl flex items-center  bg-red-900'>
                <IoCloseSharp />
              </button>
            </div>

            <div className="bg-white rounded-lg relative px-6 py-7">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-7 gap-y-10">
                  <div className="w-full md:row-span-2 lg:row-span-2">
                    {previewSrc || user.profileIMG ? (
                      <div className="relative flex justify-center">
                        <img
                          src={`${process.env.REACT_APP_DOMAIN_URL}/${previewSrc || user.profileIMG}`}
                          alt="Profile"
                          className="min-w-64 min-h-60 max-h-60 max-w-64 rounded-lg w-auto"
                        />
                        <button
                          className="absolute right-3 top-2 text-black bg-blue-100 rounded p-1"
                          onClick={deleteImage}
                        >
                          <MdClose />
                        </button>
                      </div>
                    ) : (
                      <div className="h-60 flex items-center rounded-lg justify-center border border-gray-400 border-dashed cursor-pointer">
                        <label className="flex flex-col items-center justify-center">
                          <IoCloudUploadOutline className="text-5xl text-gray-400 mb-5" />
                          <p className="text-gray-600 text-center">
                            <span className="font-semibold text-black">
                              Click to upload profile image
                            </span>
                            <br />
                            or drag and drop
                          </p>
                          <input
                            type="file"
                            name="profileIMG"
                            className="hidden"
                            onChange={inputHandler}
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  <TextInput
                    label="Username"
                    name="username"
                    value={updatedData.username}
                    inputHandler={inputHandler}
                    placeholder="Enter your username"
                  />

                  <TextInput
                    label="Phone"
                    name="number"
                    value={updatedData.number}
                    inputHandler={inputHandler}
                    placeholder="Enter your phone number"
                  />

                  <TextInput
                    label="City"
                    name="city"
                    value={updatedData.city}
                    inputHandler={inputHandler}
                    placeholder="Enter your city"
                  />
                  <TextInput
                    label="State"
                    name="state"
                    value={updatedData.state}
                    inputHandler={inputHandler}
                    placeholder="Enter your state"
                  />


                  <div>
                    <label className='font-medium'>Gender:</label>
                    <div className='flex gap-5 py-4 px-6 mt-2'>
                      <div className='flex items-center gap-2'>
                        <input type="radio" name="gender" value={updatedData.gender} checked={updatedData.gender === 'male'} onChange={inputHandler} />
                        <label>Male</label>
                      </div>
                      <div className='flex items-center gap-2'>
                        <input type="radio" name="gender" value={updatedData.gender} checked={updatedData.gender === 'female'} onChange={inputHandler} />
                        <label>Female</label>
                      </div>
                    </div>
                  </div>


                  <TextInput
                    type="date"
                    label="Joining Date"
                    name="joiningDate"
                    value={updatedData.joiningDate}
                    inputHandler={inputHandler}
                    placeholder="Enter your gender"
                  />
                </div>

                <div className="mt-7 flex justify-center md:justify-end gap-4">
                  <button onClick={() => setIsModalOpen(false)} >
                    <Button title="Cancel" />
                  </button >

                  <button onClick={handleSubmit} >
                    <Button title="Update" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}