import React, { useState } from "react";
import { useAuth } from "../authProvider/AuthProvider";
import Button from "../component/Button";
import ProfileField from "../component/ProfileField";
import PageHeader from "../component/PageHeader";
import { FaUserLarge } from "react-icons/fa6";
import TextInput from "../component/TextInput";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";
import { FaUserEdit } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import Swal from 'sweetalert2';
import fakeimage from "../assets/fake-img2.webp"


export default function Profile() {
  const { user, userAuthentication } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [previewSrc, setPreviewSrc] = useState(
    user.profileIMG
      ? `${process.env.REACT_APP_DOMAIN_URL}/${user.profileIMG}`
      : ""
  );


  const [modalPreviewSrc, setModalPreviewSrc] = useState(previewSrc); // Modal preview
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
    dateOfBirth: user.dateOfBirth,
    profileIMG: null,
  });

  const inputHandler = (e) => {
    const { name, value, files } = e.target;

    setUpdatedData((prev) => ({
      ...prev,
      [name]: files?.[0] || value,
    }));

    // Update modal preview image when a file is selected
    if (name === "profileIMG" && files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => setModalPreviewSrc(reader.result);
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
        Swal.fire({
          title: 'Profile updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: { popup: 'custom-popup' },
        });
        setIsModalOpen(false);
        setPreviewSrc(modalPreviewSrc); // Update main profile image after submission
        await userAuthentication();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      {/* Profile Header */}
      <div>
        <PageHeader title="Your Profile" icon={<FaUserLarge />} />
      </div>

      {/* Profile Content */}
      <div className="relative bg-white shadow rounded-lg pb-6">
        <div className="z-0 absolute rounded-t-lg w-full top-0 bg-gradiant h-36 xl:h-44" />

        <div className="relative px-4 lg:px-7 grid grid-cols-12 z-10 flex flex-col md:flex-row justify-start gap-7">
          {/* Profile Image */}
          <div className="pt-6 lg:pb-6 h-fit col-span-12 lg:col-span-5 xl:col-span-4 flex justify-center">
            <img
              src={previewSrc ? previewSrc : fakeimage}
              alt={user.username}
              className="w-96 h-96 rounded-lg transition-all duration-500 hover:filter hover:grayscale-[80%] hover:brightness-[90%]"
            />
          </div>

          {/* Profile Details */}
          <div className="flex flex-col col-span-12 lg:col-span-7 xl:col-span-8">
            <div className="w-full flex items-center text-black lg:text-white lg:h-36 xl:h-44">
              <div>
                <h2 className="text-3xl md:text-5xl xl:text-6xl font-semibold italic">
                  {user.username}
                </h2>
                <p className="text-base md:text-lg xl:text-xl mt-3">
                  {user.jobPosition}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg::grid-cols-2 xl:grid-cols-3 py-6 gap-x-7 gap-y-6">
              <ProfileField label="Department" value={user.department} />
              {user.jobRole && <ProfileField label="Job Role" value={user.jobRole} />}
              <ProfileField label="Phone" value={user.number} />
              <ProfileField
                label="Joined"
                value={new Date(user.joiningDate).toLocaleDateString()}
              />
              <ProfileField label="City" value={user.city} />
              <ProfileField label="State" value={user.state} />
              <ProfileField label="Gender" value={user.gender} />
              <ProfileField label="Email" value={user.email} />
              <ProfileField label="Date Of Birth" value={user.dateOfBirth} />
            </div>
          </div>
        </div>

        {/* Update Button */}
        <div className="mt-5 flex justify-center">
          <button onClick={() => setIsModalOpen(true)}>
            <Button title="Update" />
          </button>
        </div>
      </div>

      {/* Modal for Updating Profile */}
      {isModalOpen && (
        <div className="fixed px-10 inset-0 z-40 flex justify-center bg-gray-800 bg-opacity-70">
          <div className="mt-12">
            <div className="flex justify-between items-center gap-4 my-7 bg-white py-4 px-4 rounded-lg shadow shadow-black/5">
              <div className="flex gap-3 items-center">
                <div className="group p-2 bg-gradiant text-xl text-white rounded-md cursor-pointer">
                  <FaUserEdit />
                </div>
                <h1 className="font-medium text-xl">Update Profile</h1>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded bg-gradiant h-fit text-white text-2xl flex items-center bg-red-900"
              >
                <IoCloseSharp />
              </button>
            </div>

            {/* Modal Content */}
            <div className="bg-white rounded-lg relative px-6 py-7">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:md:grid-cols-4 gap-x-7 gap-y-7">
                  <div className="w-full md:row-span-2 lg:row-span-2 relative">
                    <div className="relative z-0 flex justify-center items-center">
                      <img
                        src={modalPreviewSrc || fakeimage} // Modal preview image
                        alt="Profile"
                        className="rounded-lg relative z-0 w-full h-72 object-cover border border-gray-300 "
                      />
                      <button
                        type="button"
                        className="absolute bg-gradiant  top-2 right-2 bg-gray-700 text-white rounded-full p-2 hover:bg-gray-800 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById("profileIMGInput").click();
                        }}
                      >
                        < MdOutlineEdit className="text-lg" />
                      </button>
                      <input
                        id="profileIMGInput"
                        type="file"
                        name="profileIMG"
                        className="hidden"
                        onChange={inputHandler}
                      />
                    </div>
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
                      <label className='flex items-center gap-2'>
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={updatedData.gender === 'male'}
                          onChange={inputHandler}
                        />
                        Male
                      </label>
                      <label className='flex items-center gap-2'>
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={updatedData.gender === 'female'}
                          onChange={inputHandler}
                        />
                        Female
                      </label>
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

                  <TextInput
                    type="date"
                    label="Date Of Birth"
                    name="dateOfBirth"
                    value={updatedData.dateOfBirth}
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